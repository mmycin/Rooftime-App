<script lang="ts">
	import { onMount } from 'svelte';
	import fetchUser from '../../store/User';
	import type { User } from '../../store/User';
	import { refreshData as RefreshUsers } from '../../store/User';
	import { goto } from '$app/navigation';
	import CurrentUser from '$lib/Utils/FetchUser';
	import type { FetchMode } from '$lib/Utils/Types';
	import UpdateLeaderboard from '$lib/Utils/Leaderboard';
	import { calculateTimeThisWeek } from '$lib/Utils/Algorithms';

	let users: User[] = [];
	let currentUser: User | undefined;
	let isLoading = true;
	let isRefreshing = false;

	// For Weekly Leaderboard Sorting
	let weeklySortBy: 'time' | 'weeklyScore' | 'totalScore' = 'time';

	// Function to load users data
	const loadUsers = async () => {
		let mode: FetchMode = localStorage.getItem('mode') as FetchMode;
		try {
			if (mode === 'fetch') {
				mode = 'refresh';
				return await fetchUser();
			} else {
				return await RefreshUsers();
			}
		} catch (error) {
			console.error('Error fetching users:', error);
			return [];
		} finally {
			localStorage.setItem('mode', mode as string);
		}
	};

	// Fetch users on mount
	onMount(async () => {
		users = (await loadUsers()) as User[];

		users = await UpdateLeaderboard(users) as User[];
		currentUser = await CurrentUser();
		isLoading = false;
	});

	const refreshData = async () => {
		try {
			isLoading = true;
			const newData = await RefreshUsers();
			users = newData;
		} catch (error) {
			console.error('Error refreshing data:', error);
		} finally {
			isLoading = false;
		}
	};

	// Helper to calculate total time this week
	

	// Daily Leaderboard: Sorted by Time_Today
	const dailyLeaderboard = () => {
		return users
			.filter((user) => user.Stats.length > 0)
			.map((user) => ({
				...user,
				Time_Today: user.Stats[0].Time_Today // Assuming the first stat is the most recent
			}))
			.sort((a, b) => b.Time_Today - a.Time_Today);
	};

	// Weekly Leaderboard: Sorted by selected criteria
	const weeklyLeaderboard = () => {
		return users
			.filter((user) => user.Stats.length > 0)
			.map((user) => ({
				...user,
				Time_This_Week: calculateTimeThisWeek(user.Stats[0].Daily_Stats) + user.Stats[0].Time_Today,
				Score_Week: user.Stats[0].Score_Week,
				Score_Alltime: user.Stats[0].Score_Alltime
			}))
			.sort((a, b) => {
				if (weeklySortBy === 'time') return b.Time_This_Week - a.Time_This_Week;
				if (weeklySortBy === 'weeklyScore') return b.Score_Week - a.Score_Week;
				return b.Score_Alltime - a.Score_Alltime;
			})
	};
</script>

<main class="min-h-screen text-white p-4 md:p-6 font-sans md:mb-30">
	<div class="max-w-4xl mx-auto">
		<!-- Heading and Refresh Button -->
		<div class="flex justify-between items-center mb-8 md:mb-10">
			<!-- Enhanced Leaderboard Header -->
			<h1
				class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-gradient"
			>
				Leaderboard
			</h1>
			<!-- Refresh Button (unchanged) -->
			<button
				on:click={refreshData}
				class="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 rounded-full w-10 h-10 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 active:scale-95"
				disabled={isRefreshing}
				aria-label="Refresh data"
			>
				<svg
					class={isRefreshing ? 'animate-spin' : ''}
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
					/>
				</svg>
			</button>
		</div>

		{#if isLoading}
			<!-- Loading Animation with Table Skeleton -->
			<div class="space-y-6">
				<!-- Daily Table Skeleton -->
				<section class="mb-6">
					<h2
						class="text-xl md:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
					>
						Daily Benchmark
					</h2>
					<div
						class="backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-xl border border-purple-900/30 bg-gray-800/20"
					>
						<div class="animate-pulse-gradient">
							<!-- Table header skeleton -->
							<div class="grid grid-cols-3 gap-4 border-b border-gray-700/50 pb-2 mb-2">
								<div
									class="h-4 bg-gradient-to-r from-gray-700/40 to-purple-800/30 rounded-full w-6"
								></div>
								<div
									class="h-4 bg-gradient-to-r from-gray-700/40 to-purple-800/30 rounded-full w-20"
								></div>
								<div
									class="h-4 bg-gradient-to-r from-gray-700/40 to-purple-800/30 rounded-full w-32"
								></div>
							</div>
							<!-- Table rows skeleton -->
							{#each Array(5) as _, i}
								<div class="grid grid-cols-3 gap-4 py-3 border-b border-gray-700/20">
									<div
										class="h-4 bg-gradient-to-r from-gray-700/30 to-purple-800/20 rounded-full w-4"
									></div>
									<div
										class="h-4 bg-gradient-to-r from-gray-700/30 to-purple-800/20 rounded-full w-16 md:w-24"
									></div>
									<div
										class="h-4 bg-gradient-to-r from-gray-700/30 to-purple-800/20 rounded-full w-12 md:w-20"
									></div>
								</div>
							{/each}
						</div>
					</div>
				</section>

				<!-- Weekly Table Skeleton -->
				<section>
					<h2
						class="text-xl md:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
					>
						Weekly Benchmark
					</h2>
					<div
						class="backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-xl border border-purple-900/30 bg-gray-800/20"
					>
						<div class="animate-pulse-gradient mb-4">
							<div
								class="h-6 bg-gradient-to-r from-gray-700/40 to-purple-800/20 rounded-full w-32"
							></div>
						</div>
						<div class="animate-pulse-gradient">
							<!-- Table header skeleton -->
							<div class="grid grid-cols-3 gap-4 border-b border-gray-700/50 pb-2 mb-2">
								<div
									class="h-4 bg-gradient-to-r from-gray-700/40 to-purple-800/30 rounded-full w-6"
								></div>
								<div
									class="h-4 bg-gradient-to-r from-gray-700/40 to-purple-800/30 rounded-full w-20"
								></div>
								<div
									class="h-4 bg-gradient-to-r from-gray-700/40 to-purple-800/30 rounded-full w-32"
								></div>
							</div>
							<!-- Table rows skeleton -->
							{#each Array(5) as _, i}
								<div class="grid grid-cols-3 gap-4 py-3 border-b border-gray-700/20">
									<div
										class="h-4 bg-gradient-to-r from-gray-700/30 to-purple-800/20 rounded-full w-4"
									></div>
									<div
										class="h-4 bg-gradient-to-r from-gray-700/30 to-purple-800/20 rounded-full w-16 md:w-24"
									></div>
									<div
										class="h-4 bg-gradient-to-r from-gray-700/30 to-purple-800/20 rounded-full w-12 md:w-20"
									></div>
								</div>
							{/each}
						</div>
					</div>
				</section>
			</div>
		{:else}
			<!-- Daily Leaderboard -->
			<section class="mb-8 md:mb-12">
				<h2
					class="text-xl md:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
				>
					Daily Benchmark
				</h2>
				<div
					class="backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-purple-900/30 bg-gray-800/20"
				>
					<div class="overflow-x-auto">
						<table class="min-w-full">
							<thead>
								<tr
									class="bg-gradient-to-r from-gray-800/50 to-purple-900/20 border-b border-purple-800/30"
								>
									<th
										class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider text-purple-300"
										>#</th
									>
									<th
										class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider text-purple-300"
										>Name</th
									>
									<th
										class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider text-purple-300"
										>Time Today</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-700/20">
								{#each dailyLeaderboard() as user, index}
									<tr class="hover:bg-purple-900/10 transition-colors duration-200">
										<!-- Serial Number with Spacing -->
										<td class="px-4 py-4 text-sm md:text-base">
											{#if index < 3}
												<span
													class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold relative"
												>
													{#if index === 0}
														<!-- 1st place: Dark purple gradient -->
														<span
															class="absolute w-8 h-8 rounded-full bg-gradient-to-r from-purple-800 to-purple-900 opacity-90"
														></span>
														<span class="relative z-10 text-purple-300 font-bold">{index + 1}</span>
													{:else if index === 1}
														<!-- 2nd place: Dark gray gradient -->
														<span
															class="absolute w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 opacity-90"
														></span>
														<span class="relative z-10 text-gray-300 font-bold">{index + 1}</span>
													{:else}
														<!-- 3rd place: Dark amber gradient -->
														<span
															class="absolute w-8 h-8 rounded-full bg-gradient-to-r from-amber-800 to-amber-900 opacity-90"
														></span>
														<span class="relative z-10 text-amber-300 font-bold">{index + 1}</span>
													{/if}
												</span>
											{:else}
												<!-- Plain style for ranks below 3 -->
												<span class="text-gray-500 pl-2">{index + 1}</span>
											{/if}
										</td>
										<td class="px-4 py-4 text-sm md:text-base font-medium">
											<div class="flex items-center space-x-1.5">
												<span class="truncate max-w-xs inline-block">{user.Name}</span>
												<button
													class="text-gray-400 hover:text-blue-500 transition-colors duration-150 focus:outline-none"
													style="cursor: pointer;"
													aria-label="User details"
													on:click|preventDefault={() => {
														if (currentUser && user.id === currentUser.id) {
															goto('/dashboard/profile/');
															return;
														}
														goto(`/dashboard/user/${user.id}`);
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												</button>
											</div>
										</td>
										<td class="px-4 py-4 text-sm md:text-base">
											<span
												class="font-mono bg-purple-900/20 px-2 py-1 rounded inline-flex items-center"
											>
												<span>{user.Time_Today}</span>
												<span class="text-xs text-purple-300 ml-1">min</span>
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<!-- Weekly Leaderboard -->
			<section>
				<h2
					class="text-xl md:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
				>
					Weekly Benchmark
				</h2>
				<div class="flex flex-col space-y-4">
					<!-- Sort selection (unchanged) -->
					<div
						class="backdrop-blur-sm rounded-lg p-3 flex flex-wrap gap-2 sm:gap-4 items-center border border-purple-900/20 shadow-lg bg-gray-800/10"
					>
						<span class="text-xs md:text-sm text-purple-300">Sort by</span>
						<div class="flex flex-wrap gap-2">
							<button
								class={`text-xs md:text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${
									weeklySortBy === 'time'
										? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
										: 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/40'
								}`}
								on:click={() => (weeklySortBy = 'time')}
							>
								Time
							</button>
							<button
								class={`text-xs md:text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${
									weeklySortBy === 'weeklyScore'
										? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
										: 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/40'
								}`}
								on:click={() => (weeklySortBy = 'weeklyScore')}
							>
								Weekly Score
							</button>
							<button
								class={`text-xs md:text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${
									weeklySortBy === 'totalScore'
										? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
										: 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/40'
								}`}
								on:click={() => (weeklySortBy = 'totalScore')}
							>
								Total Score
							</button>
						</div>
					</div>

					<!-- Weekly leaderboard table -->
					<div
						class="backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-purple-900/30 bg-gray-800/20"
					>
						<div class="overflow-x-auto">
							<table class="min-w-full">
								<thead>
									<tr
										class="bg-gradient-to-r from-gray-800/50 to-purple-900/20 border-b border-purple-800/30"
									>
										<th
											class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider text-purple-300"
											>#</th
										>
										<th
											class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider text-purple-300"
											>Name</th
										>
										<th
											class="px-4 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider text-purple-300"
										>
											{#if weeklySortBy === 'time'}
												Time This Week
											{:else if weeklySortBy === 'weeklyScore'}
												Score This Week
											{:else}
												Score Total
											{/if}
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-700/20">
									{#each weeklyLeaderboard() as user, index}
										<tr class="hover:bg-purple-900/10 transition-colors duration-200">
											<!-- Serial Number with Spacing -->
											<td class="px-4 py-4 text-sm md:text-base">
												{#if index < 3}
													<span
														class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold relative"
													>
														{#if index === 0}
															<!-- 1st place: Dark purple gradient -->
															<span
																class="absolute w-8 h-8 rounded-full bg-gradient-to-r from-purple-700 to-purple-800 opacity-90"
															></span>
															<span class="relative z-10 text-purple-200 font-bold"
																>{index + 1}</span
															>
														{:else if index === 1}
															<!-- 2nd place: Dark gray gradient -->
															<span
																class="absolute w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-90"
															></span>
															<span class="relative z-10 text-gray-200 font-bold">{index + 1}</span>
														{:else}
															<!-- 3rd place: Dark blue gradient -->
															<span
																class="absolute w-8 h-8 rounded-full bg-gradient-to-r from-blue-700 to-blue-800 opacity-90"
															></span>
															<span class="relative z-10 text-blue-200 font-bold">{index + 1}</span>
														{/if}
													</span>
												{:else}
													<!-- Plain style for ranks below 3 -->
													<span class="text-gray-500 pl-2">{index + 1}</span>
												{/if}
											</td>
											<td class="px-4 py-4 text-sm md:text-base font-medium">
												<div class="flex items-center space-x-1.5">
													<span class="truncate max-w-xs inline-block">{user.Name}</span>
													<button
														class="text-gray-400 hover:text-blue-500 transition-colors duration-150 focus:outline-none"
														style="cursor: pointer;"
														aria-label="User details"
														on:click|preventDefault={() => {
															if (currentUser && user.id === currentUser.id) {
																goto('/dashboard/profile/');
																return;
															}
															goto(`/dashboard/user/${user.id}`);
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-4 w-4"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													</button>
												</div>
											</td>
											<td class="px-4 py-4 text-sm md:text-base">
												<span
													class="font-mono bg-purple-900/20 px-2 py-1 rounded inline-flex items-center"
												>
													{#if weeklySortBy === 'time'}
														<span>{user.Time_This_Week}</span>
														<span class="text-xs text-purple-300 ml-1">min</span>
													{:else if weeklySortBy === 'weeklyScore'}
														<span>{user.Score_Week}</span>
														<span class="text-xs text-purple-300 ml-1">pts</span>
													{:else}
														<span>{user.Score_Alltime}</span>
														<span class="text-xs text-purple-300 ml-1">pts</span>
													{/if}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
		{/if}
	</div>
</main>

<style>
	/* Custom styles */
	:global(body) {
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	/* Animated gradient for the header */
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.animate-gradient {
		background-size: 200% 200%;
		animation: gradient 5s ease infinite;
	}

	/* Scrollbar styles (unchanged) */
	* {
		scrollbar-width: thin;
		scrollbar-color: rgba(139, 92, 246, 0.5) rgba(31, 41, 55, 0.5);
	}

	*::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	*::-webkit-scrollbar-track {
		background: rgba(31, 41, 55, 0.2);
		border-radius: 8px;
	}

	*::-webkit-scrollbar-thumb {
		background-color: rgba(139, 92, 246, 0.5);
		border-radius: 8px;
	}

	*::-webkit-scrollbar-thumb:hover {
		background-color: rgba(139, 92, 246, 0.8);
	}

	/* Glass morphism effect */
	.backdrop-blur-sm {
		backdrop-filter: blur(8px);
	}

	/* Table row hover effect */
	tr {
		position: relative;
		overflow: hidden;
	}

	tr:hover::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.05), transparent);
		transform: translateX(-100%);
		animation: shine 1.5s infinite;
	}

	@keyframes shine {
		100% {
			transform: translateX(100%);
		}
	}
</style>
