<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { users, type User } from '../../../../store/User';
	import CurrentUser from '$lib/components/Utils/FetchUser';
	import { HashPassword } from '$lib/components/Utils/HashPass';
	// @ts-ignore
	import Notify from 'notifier-mycin';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let user: User | undefined;
	let updatedData: User = {} as User;

	let newPassword = '';
	let confirmPassword = '';
	let focusedField = '';
	let isSubmitting = false;

	// Phone regex: ^(?:\+88)?01[3-9]\d{8}$
	const phoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;

	onMount(async () => {
		user = await CurrentUser();
		if (user) {
			updatedData = { ...user };
		}
	});

	// Reactive flag to check if any form field has changed
	$: formChanged =
		user &&
		(JSON.stringify(updatedData) !== JSON.stringify(user) ||
			newPassword !== '' ||
			confirmPassword !== '');
			
	// Password validation
	$: passwordsMatch = newPassword === confirmPassword;
	$: passwordError = (newPassword || confirmPassword) && !passwordsMatch;

	// Save changes: Validate new password match if provided, then log data
	async function handleSaveChanges() {
		if (passwordError) {
			return;
		}
		
		isSubmitting = true;

		// Here you could add additional logic, like calling an API to update the user.
		const dataToSave = {
			...updatedData,
			...(newPassword ? { Password: await HashPassword(newPassword) } : {}) // update password if provided
		};
		
		try {
			await users.update(user!.id, dataToSave);
			Notify('Saved Successfully', 3000, 'success');
			goto('/dashboard/profile/');
		} catch (error) {
			Notify('Error saving data', 3000, 'error');
		} finally {
			isSubmitting = false;
			newPassword = '';
			confirmPassword = '';
		}
	}

	// Reset the form fields to the initial user data
	function handleResetForm() {
		if (user) {
			updatedData = { ...user };
			newPassword = '';
			confirmPassword = '';
		}
	}

	// Go back to the previous page
	function goBack() {
		window.history.back();
	}
	
	// Set the focused field
	function setFocus(fieldName) {
		focusedField = fieldName;
	}
	
	// Clear the focused field
	function clearFocus() {
		focusedField = '';
	}
</script>

<div class="max-w-4xl mx-auto p-4 md:p-8 rounded-xl shadow-2xl mb-30" in:fade={{ duration: 300 }}>
	{#if user}
		<div class="mb-6">
			<h2 class="text-2xl font-semibold text-white mb-1">Profile Settings</h2>
			<p class="text-gray-400 text-sm">Update your personal information and account settings</p>
		</div>
		
		<form class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Left column -->
				<div class="space-y-6">
					<!-- Name -->
					<div class="relative group">
						<label for="name" class="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
						<div class="relative">
							<input
								type="text"
								id="name"
								class="w-full p-3 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
									focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
									transition-all duration-200"
								class:ring-2={focusedField === 'name'}
								class:ring-indigo-500={focusedField === 'name'}
								value={updatedData.Name}
								on:input={(e) => (updatedData = { ...updatedData, Name: e.target!.value })}
								on:focus={() => setFocus('name')}
								on:blur={clearFocus}
							/>
							<div class="absolute inset-0 rounded-lg shadow-sm pointer-events-none"></div>
						</div>
					</div>

					<!-- Username -->
					<div class="relative group">
						<label for="username" class="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
						<div class="relative">
							<input
								type="text"
								id="username"
								class="w-full p-3 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
									focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
									transition-all duration-200"
								class:ring-2={focusedField === 'username'}
								class:ring-indigo-500={focusedField === 'username'}
								value={updatedData.Username}
								on:input={(e) => (updatedData = { ...updatedData, Username: e.target.value })}
								on:focus={() => setFocus('username')}
								on:blur={clearFocus}
							/>
						</div>
					</div>

					<!-- Email -->
					<div class="relative group">
						<label for="email" class="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
						<div class="relative">
							<input
								type="email"
								id="email"
								class="w-full p-3 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
									focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
									transition-all duration-200"
								class:ring-2={focusedField === 'email'}
								class:ring-indigo-500={focusedField === 'email'}
								value={updatedData.Email}
								on:input={(e) => (updatedData = { ...updatedData, Email: e.target.value })}
								on:focus={() => setFocus('email')}
								on:blur={clearFocus}
							/>
						</div>
					</div>

					<!-- Phone Number -->
					<div class="relative group">
						<label for="phone" class="block text-sm font-medium text-gray-400 mb-1.5">Phone Number</label>
						<div class="relative">
							<input
								type="text"
								id="phone"
								class="w-full p-3 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
									focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
									transition-all duration-200"
								class:ring-2={focusedField === 'phone'}
								class:ring-indigo-500={focusedField === 'phone'}
								value={updatedData.Phone_Number}
								on:input={(e) => (updatedData = { ...updatedData, Phone_Number: e.target.value })}
								pattern={phoneRegex.source}
								placeholder="+8801xxxxxxxxx"
								on:focus={() => setFocus('phone')}
								on:blur={clearFocus}
								required
							/>
						</div>
						<p class="mt-1 text-xs text-gray-400">Format: +8801XXXXXXXXX</p>
					</div>
				</div>
				
				<!-- Right column -->
				<div class="space-y-6">
					<!-- About Info (Rich Textbox) -->
					<div class="relative group">
						<label for="about" class="block text-sm font-medium text-gray-400 mb-1.5">About Info</label>
						<div class="relative">
							<textarea
								id="about"
								class="w-full p-3 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
									focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
									transition-all duration-200 resize-y"
								class:ring-2={focusedField === 'about'}
								class:ring-indigo-500={focusedField === 'about'}
								rows="5"
								value={updatedData.About_Info}
								on:input={(e) => (updatedData = { ...updatedData, About_Info: e.target.value })}
								on:focus={() => setFocus('about')}
								on:blur={clearFocus}
							></textarea>
						</div>
					</div>

					<!-- Password Section -->
					<div class="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
						<h3 class="text-sm font-medium text-gray-300 mb-3">Change Password</h3>

						<!-- New Password -->
						<div class="mb-4 relative group">
							<label for="newPassword" class="block text-xs text-gray-400 mb-1.5">New Password</label>
							<div class="relative">
								<input
									type="password"
									id="newPassword"
									class="w-full p-2.5 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
										focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
										transition-all duration-200"
									class:ring-2={focusedField === 'newPassword'}
									class:ring-indigo-500={focusedField === 'newPassword'}
									class:border-red-500={passwordError}
									bind:value={newPassword}
									placeholder="Enter new password"
									on:focus={() => setFocus('newPassword')}
									on:blur={clearFocus}
								/>
							</div>
						</div>

						<!-- Confirm Password -->
						<div class="relative group">
							<label for="confirmPassword" class="block text-xs text-gray-400 mb-1.5">Confirm Password</label>
							<div class="relative">
								<input
									type="password"
									id="confirmPassword"
									class="w-full p-2.5 bg-gray-700/60 border border-gray-600 text-white rounded-lg 
										focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
										transition-all duration-200"
									class:ring-2={focusedField === 'confirmPassword'}
									class:ring-indigo-500={focusedField === 'confirmPassword'}
									class:border-red-500={passwordError}
									bind:value={confirmPassword}
									placeholder="Confirm new password"
									on:focus={() => setFocus('confirmPassword')}
									on:blur={clearFocus}
								/>
							</div>
							{#if passwordError}
								<p class="mt-1.5 text-xs text-red-400" in:fly={{ y: -5, duration: 200 }}>
									Passwords don't match
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Buttons -->
			<div class="pt-4 border-t border-gray-700">
				<div class="flex flex-col sm:flex-row gap-3">
					<button
						type="button"
						class="relative flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 
							transition-all duration-200 font-medium
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
							disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
						on:click={handleSaveChanges}
						disabled={!formChanged || passwordError || isSubmitting}
					>
						{#if isSubmitting}
							<span class="flex items-center justify-center">
								<svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Saving...
							</span>
						{:else}
							<span>Save Changes</span>
							<span class="absolute inset-0 flex items-center justify-center bg-indigo-800 opacity-0 
								group-hover:opacity-20 transition-opacity duration-200"></span>
						{/if}
					</button>
					<button
						type="button"
						class="flex-1 bg-gray-600/50 text-white py-3 px-4 rounded-lg hover:bg-gray-600 
							transition-all duration-200 font-medium
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
							disabled:opacity-60 disabled:cursor-not-allowed"
						on:click={handleResetForm}
						disabled={!formChanged}
					>
						Reset Form
					</button>
					<button
						type="button"
						class="flex-1 bg-transparent text-white py-3 px-4 rounded-lg border border-gray-600
							hover:bg-gray-700/50 transition-all duration-200 font-medium
							focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						on:click={goBack}
					>
						Go Back
					</button>
				</div>
			</div>
		</form>
	{:else}
		<div class="flex items-center justify-center py-12">
			<div class="animate-pulse flex flex-col items-center">
				<div class="rounded-full bg-gray-700 h-12 w-12 mb-4"></div>
				<div class="h-4 bg-gray-700 rounded w-48 mb-2.5"></div>
				<div class="h-3 bg-gray-700 rounded w-32"></div>
			</div>
		</div>
	{/if}
</div>