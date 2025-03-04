<script lang="ts">
	import { onMount } from 'svelte';
	import type { User } from '../../../../store/User';
	import CurrentUser from '$lib/Utils/FetchUser';
	import type { RecordModel } from 'pocketbase';
	import fetchStats, { stats as Statistics } from '../../../../store/Statistics';
    // @ts-ignore
	import Notify from 'notifier-mycin';
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import { spring } from 'svelte/motion';
	import { ReLU } from '$lib/Utils/Algorithms';

	let currentUser: User | undefined;
	let stats: RecordModel[];
	let userStat: RecordModel | undefined;
	let timeToday = spring(0, { stiffness: 0.1, damping: 0.3 });
	let initialTime: number = 0;
	let isLoading: boolean = true;
	let isSaveEnabled: boolean = false;
	let isGoBackVisible: boolean = false;
	let isEditMode: boolean = false;
	let wheelRef: HTMLDivElement;
	let inputRef: HTMLInputElement;

	onMount(async () => {
		try {
			currentUser = await CurrentUser();
			stats = await fetchStats();
			userStat = stats.find(stat => stat.Owner === currentUser!.id);
			timeToday.set(userStat!.Time_Today);
			initialTime = userStat!.Time_Today;
		} catch (error) {
			console.error('Error loading data:', error);
			Notify('Failed to load user data', 3000, 'error');
		} finally {
			isLoading = false;
		}
	});

	async function saveTime() {
		if (!isSaveEnabled) return;

		try {
			userStat!.Time_Today = $timeToday;
			await Statistics.update(userStat!.id, userStat!);
			Notify('Time Updated Successfully');
			isGoBackVisible = true;
			initialTime = $timeToday;
			isSaveEnabled = false;
		} catch (error) {
			console.error(error);
			Notify('Error Updating Time', 3000, 'error');
		}
	}

	function checkChanges() {
		isSaveEnabled = $timeToday !== initialTime && $timeToday >= 0 && $timeToday <= 1440;
	}

	function goBack() {
		goto("/dashboard/timer");
	}

	// Format time display
	function formatTime(minutes: number): string {
		const hours = ReLU(minutes / 60);
		const remainingMinutes = ReLU(minutes % 60);
		return hours > 0 
			? `${hours} hr ${remainingMinutes} min` 
			: `${minutes} min`;
	}

	// Wheel interaction for desktop and mobile
	function handleWheel(event: WheelEvent | TouchEvent) {
		event.preventDefault();
		let delta = 0;

		if (event instanceof WheelEvent) {
			delta = event.deltaY > 0 ? -1 : 1;
		} else if (event instanceof TouchEvent) {
			// Touch events for mobile
			const touch = event.touches[0];
			const touchStartY = touch.clientY;
			
			const handleTouchMove = (moveEvent: TouchEvent) => {
				const touchMoveY = moveEvent.touches[0].clientY;
				const diff = ReLU(touchStartY - touchMoveY);
				delta = diff > 0 ? -1 : 1;
				timeToday.set(ReLU(Math.min(Math.max(0, $timeToday + delta), 1440)));
				checkChanges();
				document.removeEventListener('touchmove', handleTouchMove);
				document.removeEventListener('touchend', handleTouchEnd);
			};

			const handleTouchEnd = () => {
				document.removeEventListener('touchmove', handleTouchMove);
				document.removeEventListener('touchend', handleTouchEnd);
			};

			document.addEventListener('touchmove', handleTouchMove);
			document.addEventListener('touchend', handleTouchEnd);
			return;
		}

		timeToday.set(ReLU(Math.min(Math.max(0, $timeToday + delta), 1440)));
		checkChanges();
	}

	// Reset time to initial value
	function resetTime() {
		timeToday.set(initialTime);
		checkChanges();
	}

	// Toggle edit mode
	function toggleEditMode() {
		isEditMode = !isEditMode;
		if (isEditMode) {
			setTimeout(() => inputRef?.focus(), 100);
		}
	}

	// Manual input handling
	function handleManualInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseInt(input.value);
		if (!isNaN(value) && value >= 0 && value <= 1440) {
			timeToday.set(value);
			checkChanges();
		}
	}
</script>

{#if !isLoading}
	<div 
		class="flex items-center justify-center min-h-screen px-4 py-6 bg-gray-900 overflow-y-auto" 
		transition:fade={{ duration: 300, easing: circOut }}
		style="width: 100vw; height: 100vh; overflow-y: auto;"
	>
		<div 
			class="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
			transition:slide={{ duration: 300, easing: circOut }}
		>
			<div class="p-6">
				<h1 class="text-2xl font-bold text-teal-400 mb-6 text-center tracking-tight">
					Update Daily Time
				</h1>

				<div class="space-y-4">
					{#if !isEditMode}
						<div 
							class="relative w-full aspect-square bg-gray-700 rounded-full border-4 border-gray-600 
								   flex items-center justify-center select-none cursor-pointer touch-none"
							on:wheel={handleWheel}
							on:touchmove={handleWheel} 
							bind:this={wheelRef}
						>
							<div class="text-center">
								<p class="text-gray-300 text-lg mb-2">Time Spent Today</p>
								<div class="text-6xl font-bold text-teal-400">
									{Math.round($timeToday)}
								</div>
								<p class="text-gray-400 text-lg mt-2">
									{formatTime(Math.round($timeToday))}
								</p>
							</div>
						</div>
					{:else}
						<div>
							<label 
								for="timeInput" 
								class="block text-sm font-medium text-gray-300 mb-2"
							>
								Time Spent Today (minutes)
							</label>
							<input
								id="timeInput"
								type="number"
								min="0"
								max="1440"
								bind:this={inputRef}
								value={Math.round($timeToday)}
								on:input={handleManualInput}
								class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white 
									   focus:ring-2 focus:ring-teal-500 focus:outline-none 
									   transition duration-300 ease-in-out text-lg"
							/>
						</div>
					{/if}

					<p class="text-center text-gray-400 text-sm">
						{#if !isEditMode}
							Scroll/Swipe to adjust time (0-1440 mins)
						{:else}
							Manually enter time in minutes
						{/if}
					</p>

					<div class="flex space-x-2">
						<button
							class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold 
								   py-3 px-4 rounded-lg transition duration-300 ease-in-out 
								   transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
							on:click={toggleEditMode}
						>
							{isEditMode ? 'Wheel Mode' : 'Text Mode'}
						</button>
						<button
							class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold 
								   py-3 px-4 rounded-lg transition duration-300 ease-in-out 
								   transform hover:scale-[1.02] active:scale-[0.98]"
							on:click={resetTime}
						>
							Reset
						</button>
					</div>

					<button
						class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 
							   rounded-lg transition duration-300 ease-in-out transform 
							   hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
						on:click={saveTime}
						disabled={!isSaveEnabled}
					>
						{isSaveEnabled ? 'Save Changes' : 'No Changes'}
					</button>

					{#if isGoBackVisible}
						<button 
							class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold 
								   py-3 px-4 rounded-lg transition duration-300 ease-in-out 
								   transform hover:scale-[1.02] active:scale-[0.98]"
							on:click={goBack}
							transition:fade
						>
							Return to Dashboard
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
		<div class="text-center">
			<svg 
				class="animate-spin h-10 w-10 mx-auto text-teal-400 mb-4" 
				xmlns="http://www.w3.org/2000/svg" 
				fill="none" 
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<p class="text-lg text-gray-300">Loading your data...</p>
		</div>
	</div>
{/if}


<style>
	/* Prevent number input spinner */
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		/* -webkit-appearance: none; */
		margin: 0;
	}
</style>