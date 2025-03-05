<script lang="ts">
	import { goto } from "$app/navigation";
	import CurrentUser from '$lib/Utils/FetchUser';
	import { onMount } from 'svelte';
	import type { User } from "../../../store/User";
	import Logout from '$lib/Utils/Logout';
	
	let currentUser: User | undefined;
	let loading = true;

	onMount(async () => {
		try {
			currentUser = await CurrentUser();
			console.log(currentUser);
		} catch (error) {
			console.error("Failed to load user data:", error);
		} finally {
			loading = false;
		}
	});

	function editProfile() {
		goto('/dashboard/profile/edit');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
	<!-- Main content -->
	<main class="container mx-auto px-4 py-8 sm:py-12 mb-20">
		{#if loading}
			<div class="flex justify-center items-center h-64">
				<!-- Modern loading spinner -->
				<div class="relative h-20 w-20">
					<div class="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
					<div class="absolute inset-0 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-300"></div>
					<div class="absolute inset-3 rounded-full border-b-2 border-teal-500 animate-spin animation-delay-600"></div>
				</div>
			</div>
		{:else if currentUser}
			<div class="max-w-5xl mx-auto">
				<!-- Profile Header - Full width on mobile and desktop -->
				<div class="relative mb-20 sm:mb-24">
					<!-- Background card with subtle animation -->
					<div class="h-40 sm:h-48 md:h-56 rounded-xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 overflow-hidden shadow-xl">
						<div class="absolute inset-0 bg-pattern opacity-20"></div>
						<div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
					</div>
					
					<!-- Profile picture with centered positioning -->
					<div class="absolute -bottom-16 left-0 right-0 flex justify-center">
						<div class="relative group">
							<div class="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-xl shadow-blue-900/30 transition-transform duration-300 group-hover:scale-105">
								<div class="h-full w-full rounded-full bg-gray-800 flex items-center justify-center">
									<span class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{currentUser.Name.charAt(0)}</span>
								</div>
							</div>
							<!-- Glow effect -->
							<div class="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-md -z-10"></div>
						</div>
					</div>
				</div>
				
				<!-- Name and Username centered below avatar -->
				<div class="text-center mb-8">
					<h1 class="text-2xl sm:text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{currentUser.Name}</h1>
					<p class="text-gray-400">@{currentUser.Username}</p>
				</div>
				
				<!-- Profile content in responsive grid -->
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<!-- Left column - User Bio & Actions -->
					<div class="lg:col-span-4 space-y-6">
						<!-- Bio card -->
						<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
								</svg>
								<h3 class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">About</h3>
							</div>
							
							<div class="p-5">
								<div class="bg-gray-900/50 rounded-lg p-4 text-gray-300 text-sm leading-relaxed">
									{@html currentUser.About_Info || 'No bio available'}
								</div>
							</div>
						</div>
						
						<!-- Actions card -->
						<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
								</svg>
								<h3 class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Actions</h3>
							</div>
							
							<div class="p-5 space-y-3">
								<button on:click={editProfile} 
									class="w-full relative overflow-hidden rounded-lg group">
									<span class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
									<span class="relative px-4 py-3 bg-gray-900/30 backdrop-blur-sm border border-white/10 group-hover:bg-transparent group-hover:border-transparent transition-all duration-300 rounded-lg flex items-center justify-center text-sm font-medium">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
										Edit Profile
									</span>
								</button>
								
								<button on:click={Logout} 
									class="w-full relative overflow-hidden rounded-lg group">
									<span class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
									<span class="relative px-4 py-3 bg-gray-900/30 backdrop-blur-sm border border-white/10 group-hover:bg-transparent group-hover:border-transparent transition-all duration-300 rounded-lg flex items-center justify-center text-sm font-medium">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 5a1 1 0 10-2 0v4.3l-1.15-1.15a1 1 0 10-1.4 1.4l3 3a1 1 0 001.4 0l3-3a1 1 0 00-1.4-1.4L12 12.3V8z" clip-rule="evenodd" />
										</svg>
										Logout
									</span>
								</button>
							</div>
						</div>
						
						<!-- Admin badge if applicable -->
						{#if currentUser.Admin}
							<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-amber-700/30 overflow-hidden">
								<div class="px-5 py-5 bg-gradient-to-r from-amber-900/30 to-amber-800/20">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
												<path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd" />
											</svg>
										</div>
										<div class="ml-4">
											<p class="text-base font-semibold text-amber-400">Administrator</p>
											<p class="text-sm text-amber-400/70 mt-1">Full system access</p>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
					
					<!-- Right column - Contact & Account Info -->
					<div class="lg:col-span-8 space-y-6">
						<!-- Contact information section -->
						<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<h3 class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Contact Information</h3>
							</div>
							
							<div class="p-5">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<!-- Email card -->
									<div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-blue-500/30 transition-all duration-300">
										<div class="flex items-center">
											<div class="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
													<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
													<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
												</svg>
											</div>
											<div class="ml-4">
												<p class="text-sm font-medium text-blue-400">Email Address</p>
												<p class="text-gray-300 font-mono text-sm mt-1 break-all"><a href="mailto:{currentUser.Email}" class="hover:underline">{currentUser.Email}</a></p>
											</div>
										</div>
									</div>
									
									<!-- Phone card -->
									<div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-green-500/30 transition-all duration-300">
										<div class="flex items-center">
											<div class="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all duration-300">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
													<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
												</svg>
											</div>
											<div class="ml-4">
												<p class="text-sm font-medium text-green-400">Phone Number</p>
												<p class="text-gray-300 font-mono text-sm mt-1"><a href="tel:{currentUser.Phone_Number}" class="hover:underline">{currentUser.Phone_Number || 'Not provided'}</a></p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Account details -->
						<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
								<h3 class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Account Details</h3>
							</div>
							
							<div class="p-5">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<!-- Username card -->
									<div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-purple-500/30 transition-all duration-300">
										<div class="flex flex-col">
											<div class="flex items-center mb-2">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
													<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
												</svg>
												<p class="text-sm font-medium text-purple-400">Username</p>
											</div>
											<div class="flex items-center mt-1">
												<span class="bg-purple-500/10 text-purple-300 rounded-md px-3 py-1.5 text-sm font-mono border border-purple-500/20">@{currentUser.Username}</span>
											</div>
										</div>
									</div>
									
									<!-- Account type card -->
									<div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-pink-500/30 transition-all duration-300">
										<div class="flex flex-col">
											<div class="flex items-center mb-2">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-pink-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
													<path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
												</svg>
												<p class="text-sm font-medium text-pink-400">Account Type</p>
											</div>
											<div class="flex items-center mt-1">
												{#if currentUser.Admin}
													<span class="bg-yellow-500/10 text-yellow-300 rounded-md px-3 py-1.5 text-sm font-mono border border-yellow-500/20">Administrator</span>
												{:else}
													<span class="bg-blue-500/10 text-blue-300 rounded-md px-3 py-1.5 text-sm font-mono border border-blue-500/20">Standard User</span>
												{/if}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Error state with improved styling -->
			<div class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-red-900/30 p-8 text-center max-w-lg mx-auto">
				<div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 text-red-400 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-xl font-bold text-red-400 mb-2">Unable to load profile</h3>
				<p class="text-gray-400 mb-6">We couldn't retrieve your profile information. Please try again.</p>
				<button class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all">
					Refresh Page
				</button>
			</div>
		{/if}
	</main>
</div>

<style>
	/* Background pattern */
	.bg-pattern {
		background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwTDYwIDYwWk02MCAwTDAgNjBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==');
		background-size: 30px 30px;
	}

	/* Custom animations */
	.animation-delay-300 {
		animation-delay: 300ms;
	}
	
	.animation-delay-600 {
		animation-delay: 600ms;
	}
</style>