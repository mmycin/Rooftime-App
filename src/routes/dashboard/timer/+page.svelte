<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import type { User } from '../../../store/User';
	import fetchStats from '../../../store/Statistics';
	import type { RecordModel } from 'pocketbase';
	import { goto } from '$app/navigation';
	import CurrentUser from '$lib/components/Utils/FetchUser';
	import { stats as RecordStats } from '../../../store/Statistics';

	let user: User | undefined;
	let stats: RecordModel[] = [];
	let userStat: RecordModel;
	let timeToday: number = 0; // Time is in minutes
	let running = writable(false);
	let stopwatchTime = writable(timeToday * 60); // Convert minutes to seconds for stopwatch handling
	let interval: NodeJS.Timeout;
	let isLoading = true;

	// Simpler time tracking to avoid animation bugs
	const minutes = derived(stopwatchTime, ($time) => Math.floor($time / 60));
	const seconds = derived(stopwatchTime, ($time) => $time % 60);
	const hours = derived(stopwatchTime, ($time) => Math.floor($time / 3600));

	onMount(async () => {
		try {
			user = await CurrentUser();
			stats = await fetchStats();
			userStat = stats.filter((stat) => stat.Owner === user!.id)[0];
			timeToday = userStat.Time_Today;
			stopwatchTime.set(timeToday * 60); // Initialize the stopwatch with timeToday in seconds
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			// Add a slight delay for loading animation
			setTimeout(() => {
				isLoading = false;
			}, 800);
		}
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	const formatHMSTime = (time: number) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	};

	const startStopwatch = () => {
		running.set(true);
		interval = setInterval(() => {
			stopwatchTime.update((time) => time + 1); // Increase time by 1 second
		}, 1000);
	};

	const pauseStopwatch = () => {
		running.set(false);
		clearInterval(interval); // Stop the stopwatch interval
		const ceilTime = Math.ceil($stopwatchTime / 60);
		// Update the time in the user stats or make an API call if needed
		userStat.Time_Today = ceilTime; // Store the floored minutes back in userStat
		console.log(userStat);
		RecordStats.update(userStat!.id, userStat); // Update the user's stats in the database
	};

	const navigateToEdit = () => {
		goto('/dashboard/timer/edit');
	};
</script>

<div
	class="flex items-center justify-center p-2 w-full h-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden"
>
	<!-- Subtle background elements - positioned to avoid overlap -->
	<div class="fixed top-0 right-0 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl"></div>
	<div class="fixed bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl"></div>

	{#if isLoading}
		<div class="flex flex-col items-center justify-center p-6">
			<!-- Loading animation -->
			<div class="w-16 h-16 relative mb-6">
				<div
					class="absolute top-0 left-0 w-full h-full border-4 border-purple-500/20 rounded-full"
				></div>
				<div
					class="absolute top-0 left-0 w-full h-full border-4 border-b-transparent border-r-transparent border-purple-500 rounded-full animate-spin"
				></div>
			</div>
			<p class="text-purple-300 font-medium text-lg">Loading timer</p>
			<div class="mt-2 flex space-x-1.5">
				<span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0s;"
				></span>
				<span
					class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
					style="animation-delay: 0.2s;"
				></span>
				<span
					class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
					style="animation-delay: 0.4s;"
				></span>
			</div>
		</div>
	{:else}
		<div
			class="stopwatch-container w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 my-4 md:my-0"
		>
			<!-- Timer card header -->
			<div class="p-4 border-b border-gray-700/50 relative overflow-hidden">
				<div class="relative z-10">
					<h2 class="text-xl font-semibold text-white text-center tracking-wide">STUDY TIMER</h2>
					<p
						class="text-center text-purple-300/80 text-sm mt-1 font-light tracking-wider uppercase"
					>
						Track Your Daily Study Time
					</p>
				</div>
			</div>

			<!-- Timer display with clean aesthetic -->
			<div class="py-12 px-4 flex justify-center items-center relative">
				<!-- Single decorative ring with better positioning -->
				<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div class="w-56 h-56 rounded-full border border-purple-500/10"></div>
				</div>

				<!-- Timer circle container - no overlapping -->
				<div class="relative">
					<!-- Glowing ring with improved positioning -->
					<div
						class={`absolute inset-0 rounded-full ${$running ? 'border-2 border-purple-500/30 shadow-lg shadow-purple-500/10' : 'border border-gray-600/30'} transition-all duration-700`}
					></div>

					<!-- Main timer circle with fixed dimensions -->
					<div
						class="relative w-48 h-48 pt-10 rounded-full flex flex-col items-center justify-center bg-gray-800/80 shadow-inner border border-gray-700/50"
					>
						<!-- Time display with fixed width to prevent overlap -->
						<div class="flex items-center justify-center space-x-2">
							<!-- Minutes with fixed width -->
							<div class="w-16 text-center">
								<span class="text-4xl font-bold text-white">
									{String($minutes).padStart(2, '0')}
								</span>
							</div>

							<!-- Colon with increased spacing -->
							<div>
								<span
									class={`text-4xl font-bold text-white ${$running ? 'animate-pulse-slow' : ''}`}
								>
									:
								</span>
							</div>

							<!-- Seconds with fixed width -->
							<div class="w-16 text-center">
								<span class="text-4xl font-bold text-white">
									{String($seconds).padStart(2, '0')}
								</span>
							</div>
						</div>

						<!-- HH:MM:SS format with more space below -->
						<div class="text-xs text-gray-400 mt-5 font-mono">
							{formatHMSTime($stopwatchTime)}
						</div>

						<!-- Status indicator with more space below -->
						<div class="mt-6 flex items-center justify-center">
							<div
								class={`w-2 h-2 rounded-full ${$running ? 'bg-teal-500 animate-pulse-slow' : 'bg-gray-600'}`}
							></div>
							<span class="ml-2 text-xs text-gray-400">{$running ? 'RUNNING' : 'PAUSED'}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Controls area with improved spacing -->
			<div class="px-6 py-4 bg-gray-900/50">
				<!-- Timer progress visualization -->
				<div class="mb-6">
					<div class="text-xs text-gray-400 mb-2 flex justify-between items-center">
						<span class="font-light">TODAY'S PROGRESS</span>
						<span class="font-mono text-teal-300">{Math.floor($stopwatchTime / 60)} min</span>
					</div>
					<!-- Progress bar with improved color scheme -->
					<div class="w-full h-2 bg-gray-800/80 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-teal-500 to-cyan-500"
							style="width: {Math.min(100, ($stopwatchTime / 60 / 10) * 100)}%"
						></div>
					</div>
				</div>

				<!-- Control buttons with improved mobile responsiveness -->
				<div class="flex flex-col gap-3">
					{#if $running}
						<!-- Mobile-friendly pause button -->
						<button
							class="w-full bg-gradient-to-br from-red-500 to-red-600 py-4 px-6 rounded-lg font-medium text-white shadow-md transition-all duration-300 hover:shadow-red-500/20 active:scale-98 touch-manipulation"
							on:click={pauseStopwatch}
							type="button"
						>
							<span class="flex items-center justify-center">
								<!-- Fixed pause icon with clear pause bars -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 mr-2"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<rect x="6" y="4" width="4" height="16" rx="1"></rect>
									<rect x="14" y="4" width="4" height="16" rx="1"></rect>
								</svg>
								Pause
							</span>
						</button>
					{:else}
						<!-- Mobile-friendly start button -->
						<button
							class="w-full bg-gradient-to-br from-teal-500 to-cyan-600 py-4 px-6 rounded-lg font-medium text-white shadow-md transition-all duration-300 hover:shadow-teal-500/20 active:scale-98 touch-manipulation"
							on:click={startStopwatch}
							type="button"
						>
							<span class="flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Start
							</span>
						</button>
					{/if}

					<!-- Mobile-friendly edit button -->
					<button
						class="w-full py-4 px-6 rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:text-teal-200 font-medium transition-all duration-300 hover:bg-gray-700/50 touch-manipulation"
						on:click={navigateToEdit}
						type="button"
					>
						<span class="flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2 text-teal-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
							Edit Timer
						</span>
					</button>
				</div>
			</div>

			<!-- Stats Summary section with updated color scheme -->
			<div class="px-6 py-4 border-t border-gray-700/30 bg-gray-900/70">
				<div class="flex justify-between items-center mb-2">
					<div class="text-xs text-gray-500">Session Time</div>
					<div class="text-teal-300 font-mono">{formatHMSTime($stopwatchTime)}</div>
				</div>
				<div class="flex justify-between items-center">
					<div class="text-xs text-gray-500">Total Today</div>
					<div class="text-teal-300 font-mono">{Math.floor($stopwatchTime / 60)} min</div>
				</div>
			</div>
		</div>
	{/if}
</div>


<style>
	/* Custom animations */
	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 1.5s ease-in-out infinite;
	}

	/* Mobile touch improvements */
	button {
		-webkit-tap-highlight-color: transparent;
		outline: none;
	}

	/* Prevent text selection on buttons */
	.touch-manipulation {
		touch-action: manipulation;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
	}

	/* Better scaling for active buttons on mobile */
	.active\:scale-98:active {
		transform: scale(0.98);
	}
</style>
