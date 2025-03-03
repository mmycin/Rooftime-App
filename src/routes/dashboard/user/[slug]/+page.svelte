<script lang="ts">
	// @ts-nocheck
	import { FetchUserByID } from '$lib/components/Utils/FetchUser.js';
	import { afterUpdate, onMount } from 'svelte';
	import type { User } from '../../../../store/User.js';
	import { Chart, registerables } from 'chart.js';
	import { Generate } from '$lib/components/Utils/AI_Chat.js';
	import CurrentUser from '$lib/components/Utils/FetchUser.js';
	import Typed from 'typed.js';
	import Logout from '$lib/components/Utils/Logout';
	import { goto } from '$app/navigation';

	Chart.register(...registerables);

	export let data;

	let user: User | undefined;
	let currentUser: User | undefined;
	let isLoading = true;
	let chart;
	let generatedResponse = '';
	let typedInstance;
	let loadingProgress = 0;
	let windowWidth;
	let isMobile = false;

	const id = data.slug;

	const handleResize = () => {
		windowWidth = window.innerWidth;
		isMobile = windowWidth < 640;

		// Rebuild chart if it exists when screen size changes significantly
		if (chart && ((isMobile && windowWidth > 640) || (!isMobile && windowWidth <= 640))) {
			chart.destroy();
			chart = null;
			setTimeout(createChart, 100); // Rebuild chart with small delay
		}
	};

	// Progress bar animation

	onMount(async () => {

		window.addEventListener('resize', handleResize);
		handleResize(); // Initial check

		// Start progress animation
		const progressInterval = incrementProgress();
		try {
			user = await FetchUserByID(id);
			currentUser = await CurrentUser();

            if(user.id === currentUser.id) {
                goto('/dashboard/profile/');
            }

			loadingProgress = 100;

			// Small delay to show complete progress
			setTimeout(() => {
				isLoading = false;
				clearInterval(progressInterval);
			}, 500);
		} catch (error) {
			console.error('Failed to load user data:', error);
			clearInterval(progressInterval);
			isLoading = false;
		} finally {
			isLoading = false;
		}
	});

	const incrementProgress = () => {
		const interval = setInterval(() => {
			if (loadingProgress < 90) {
				loadingProgress += Math.random() * 10;
			} else {
				clearInterval(interval);
			}
		}, 200);

		return interval;
	};

	function editProfile() {
		goto('/dashboard/profile/edit');
	}

	// Create the chart with proper responsiveness
	const createChart = () => {
		if (!user || !currentUser || isLoading) return;

		// Extract daily stats data
		const userDailyStats = user.Stats[0].Daily_Stats;
		const currentUserDailyStats = currentUser.Stats[0].Daily_Stats;

		// Prepare data for Chart.js
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const labels = Object.keys(userDailyStats).map((key) => daysOfWeek[parseInt(key) - 1]);

		const userData = Object.values(userDailyStats);
		const currentUserData = Object.values(currentUserDailyStats);

		// Determine device type with more granular breakpoints
		const screenWidth = window.innerWidth;
		const isSmallMobile = screenWidth < 375;
		const isMobile = screenWidth < 640;
		const isTablet = screenWidth >= 640 && screenWidth < 1024;
		const isDesktop = screenWidth >= 1024;

		// More granular responsive styling based on device type
		const styling = {
			pointRadius: isSmallMobile ? 3 : isMobile ? 4 : isTablet ? 5 : 6,
			borderWidth: isSmallMobile ? 1.5 : isMobile ? 2 : isTablet ? 2.5 : 3,
			fontSize: isSmallMobile ? 10 : isMobile ? 11 : isTablet ? 12 : 14,
			padding: {
				top: isMobile ? 30 : 10, // Increased top padding for mobile to accommodate legend
				right: isSmallMobile ? 2 : isMobile ? 5 : isTablet ? 15 : 20,
				bottom: 0,
				left: isSmallMobile ? 2 : isMobile ? 5 : isTablet ? 10 : 15
			},
			yAxisStepSize: isSmallMobile ? 90 : isMobile ? 60 : isTablet ? 45 : 30,
			legendDisplay: true, // Always show legend
			tooltipPadding: isSmallMobile ? 6 : isMobile ? 8 : isTablet ? 10 : 12
		};

		// Color scheme with better contrast and accessibility
		const colors = {
			// User colors (purple theme)
			user: {
				border: 'rgba(139, 92, 246, 1)', // Vibrant purple
				background: 'rgba(139, 92, 246, 0.15)',
				pointBorder: 'rgba(139, 92, 246, 1)',
				hoverBorder: 'rgba(167, 139, 250, 1)'
			},
			// Current user colors (green theme)
			currentUser: {
				border: 'rgba(34, 197, 94, 1)', // Vibrant green
				background: 'rgba(34, 197, 94, 0.15)',
				pointBorder: 'rgba(34, 197, 94, 1)',
				hoverBorder: 'rgba(52, 211, 153, 1)'
			},
			// UI colors
			ui: {
				background: 'rgba(17, 24, 39, 0.95)', // Dark background
				text: '#E5E7EB', // Light text
				secondaryText: '#9CA3AF', // Secondary text
				grid: 'rgba(255, 255, 255, 0.06)' // Subtle grid lines
			}
		};

		// Destroy existing chart if it exists
		if (chart) {
			chart.destroy();
		}

		// Create the chart with enhanced styling
		const ctx = document.getElementById('lineChart').getContext('2d');
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: `${user?.Username}`,
						data: userData,
						borderColor: colors.user.border,
						backgroundColor: colors.user.background,
						borderWidth: styling.borderWidth,
						pointRadius: styling.pointRadius,
						pointBackgroundColor: '#FFFFFF',
						pointBorderColor: colors.user.pointBorder,
						pointBorderWidth: 2,
						pointHoverRadius: styling.pointRadius + 2,
						pointHoverBackgroundColor: '#FFFFFF',
						pointHoverBorderColor: colors.user.hoverBorder,
						pointHoverBorderWidth: 3,
						tension: 0.3,
						fill: true
					},
					{
						label: `${currentUser?.Username} (You)`,
						data: currentUserData,
						borderColor: colors.currentUser.border,
						backgroundColor: colors.currentUser.background,
						borderWidth: styling.borderWidth,
						pointRadius: styling.pointRadius,
						pointBackgroundColor: '#FFFFFF',
						pointBorderColor: colors.currentUser.pointBorder,
						pointBorderWidth: 2,
						pointHoverRadius: styling.pointRadius + 2,
						pointHoverBackgroundColor: '#FFFFFF',
						pointHoverBorderColor: colors.currentUser.hoverBorder,
						pointHoverBorderWidth: 3,
						tension: 0.3,
						fill: true
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: styling.legendDisplay, // Always display legend
						position: 'top',
						align: 'center', // Center alignment for better mobile experience
						labels: {
							boxWidth: isMobile ? 10 : 12,
							usePointStyle: true,
							pointStyle: 'circle',
							color: colors.ui.text,
							font: {
								size: isSmallMobile ? styling.fontSize - 1 : styling.fontSize,
								family: "'Inter', sans-serif",
								weight: '500'
							},
							padding: isSmallMobile ? 6 : isMobile ? 8 : 15
						},
						// Make the legend more compact on mobile
						maxHeight: isMobile ? 30 : 50,
						maxWidth: isMobile ? screenWidth - 20 : 'auto'
					},
					tooltip: {
						enabled: true,
						backgroundColor: colors.ui.background,
						titleColor: colors.ui.text,
						bodyColor: colors.ui.text,
						borderColor: 'rgba(139, 92, 246, 0.7)',
						borderWidth: 1,
						cornerRadius: 8,
						padding: styling.tooltipPadding,
						boxPadding: 6,
						usePointStyle: true,
						titleFont: {
							size: styling.fontSize + 1,
							family: "'Inter', sans-serif",
							weight: 'bold'
						},
						bodyFont: {
							size: styling.fontSize,
							family: "'Inter', sans-serif"
						},
						callbacks: {
							title: function (tooltipItems) {
								return tooltipItems[0].label;
							},
							label: function (context) {
								return `  ${context.parsed.y} minutes`;
							}
						},
						// Add this for faster tooltip response
						animation: {
							duration: 150
						}
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							color: colors.ui.secondaryText,
							font: {
								size: styling.fontSize,
								family: "'Inter', sans-serif"
							},
							padding: isMobile ? 5 : 8,
							maxRotation: isSmallMobile ? 50 : isMobile ? 45 : 0
						},
						border: {
							display: false
						}
					},
					y: {
						grid: {
							color: colors.ui.grid,
							drawTicks: false,
							drawBorder: false,
							lineWidth: isMobile ? 0.5 : 1
						},
						ticks: {
							color: colors.ui.secondaryText,
							font: {
								size: styling.fontSize,
								family: "'Inter', sans-serif"
							},
							padding: isMobile ? 8 : 10,
							stepSize: styling.yAxisStepSize,
							callback: function (value) {
								return value + 'm';
							}
						},
						border: {
							display: false
						},
						beginAtZero: true
					}
				},
				layout: {
					padding: styling.padding
				},
				interaction: {
					mode: 'index',
					intersect: false
				},
				elements: {
					line: {
						capBezierPoints: true
					}
				},
				// Add this for smoother animations
				animation: {
					duration: isSmallMobile ? 400 : 800,
					easing: 'easeOutQuart'
				}
			}
		});

		// Add responsive resize handling
		window.addEventListener(
			'resize',
			debounce(() => {
				createChart();
			}, 250)
		);
	};

	// Helper function to prevent excessive redraws
	function debounce(func, wait) {
		let timeout;
		return function () {
			const context = this;
			const args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(context, args), wait);
		};
	}

	afterUpdate(async () => {
		if (!isLoading && !chart && user) {
			createChart();

			const dailyStats = user.Stats[0].Daily_Stats;
			const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			const labels = Object.keys(dailyStats).map((key) => daysOfWeek[parseInt(key) - 1]);
			const data = Object.values(dailyStats);

			const mydailyStats = currentUser.Stats[0].Daily_Stats;
			const myLabels = Object.keys(mydailyStats).map((key) => daysOfWeek[parseInt(key) - 1]);
			const myData = Object.values(mydailyStats);

			const hisobj = {
				labels: labels,
				data: data
			};

			const myobj = {
				labels: myLabels,
				data: myData
			};

			console.log(hisobj);
			console.log(myobj);

			const prompt = `
                # Analysis of Study Habits: A Comparison Between ${user?.Username} and Me

                I have study data for both ${user?.Username} and myself in the form of an 
                object where the keys represent the days of the week (Monday through Sunday) and the values represent t
                he study duration in minutes for each day. Please compare the study habits of both users, highlighting 
                any differences, trends, or areas where one may be performing better than the other.
                
                ## Key Points for Comparison and Analysis:
                    - Comparison of Study Time: Analyze and compare the study durations for each day of the week. 
                    Identify any patterns in consistency or fluctuations in study time.

                    - Performance and Improvement: Based on the comparison, highlight the areas where 
                    ${user?.Username} is outperforming me, and vice versa. Identify the 
                    specific days or patterns where either one is spending more or less time studying.

                    - Study Habit Insights: Provide an analysis on what specific habits or time allocation strategies can be 
                    learned by me from ${user?.Username} who is performing better. What techniques, like focused study sessions, consistency, 
                    or effective time management, are contributing to our success?

                    - Actionable Recommendations: Offer suggestions on how I can improve study habits, 
                    focusing on the areas where ${user?.Username} is excelling. Give detailed and actionable tips on time management, 
                    breaking down large tasks, or maintaining study momentum throughout the week.

                    - Optimal Study Techniques: Identify the best study techniques that can be adopted based on the comparison. 
                    Whether it's focusing on high-priority subjects, effective time blocking, or taking regular breaks, offer 
                    tailored suggestions.

                    - Long-Term Study Strategy: Based on the data, suggest a long-term study strategy that combines the best habits 
                    from both of us. This strategy should aim for overall improvement in both study time and quality.

                    ${user?.Username}'s data: 
                    ${JSON.stringify(hisobj)}
                    
                    My data: 
                    ${JSON.stringify(myobj)}

                    Be as honest and as logistical as possible. Provide a detailed, data-driven analysis based on the 
                    provided data. Also make it within 300 characters.
                
                `;

			// Fetch the generated response
			generatedResponse = await Generate(prompt, 300);

			// Initialize Typed.js for the typewriter effect
			if (typedInstance) {
				typedInstance.destroy();
			}
			typedInstance = new Typed('#generatedResponse', {
				strings: [generatedResponse],
				typeSpeed: 20,
				showCursor: false
			});
		}
	});
</script>


<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
	<!-- Main content -->
	<main class="container mx-auto px-4 py-8 sm:py-12 mb-20">
		{#if isLoading}
			<div class="flex justify-center items-center h-64">
				<!-- Modern isLoading spinner -->
				<div class="relative h-20 w-20">
					<div class="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
					<div
						class="absolute inset-0 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-300"
					></div>
					<div
						class="absolute inset-3 rounded-full border-b-2 border-teal-500 animate-spin animation-delay-600"
					></div>
				</div>
			</div>
		{:else if user}
			<div class="max-w-5xl mx-auto">
				<!-- Profile Header - Full width on mobile and desktop -->
				<div class="relative mb-20 sm:mb-24">
					<!-- Background card with subtle animation -->
					<div
						class="h-40 sm:h-48 md:h-56 rounded-xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 overflow-hidden shadow-xl"
					>
						<div class="absolute inset-0 bg-pattern opacity-20"></div>
						<div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
					</div>

					<!-- Profile picture with centered positioning -->
					<div class="absolute -bottom-16 left-0 right-0 flex justify-center">
						<div class="relative group">
							<div
								class="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-xl shadow-blue-900/30 transition-transform duration-300 group-hover:scale-105"
							>
								<div
									class="h-full w-full rounded-full bg-gray-800 flex items-center justify-center"
								>
									<span
										class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
										>{user.Name.charAt(0)}</span
									>
								</div>
							</div>
							<!-- Glow effect -->
							<div
								class="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-md -z-10"
							></div>
						</div>
					</div>
				</div>

				<!-- Name and Username centered below avatar -->
				<div class="text-center mb-8">
					<h1
						class="text-2xl sm:text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
					>
						{user.Name}
					</h1>
					<p class="text-gray-400">@{user.Username}</p>
				</div>

				<!-- Profile content in responsive grid -->
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<!-- Left column - User Bio & Actions -->
					<div class="lg:col-span-4 space-y-6">
						<!-- Bio card -->
						<div
							class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden"
						>
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-blue-400 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
										clip-rule="evenodd"
									/>
								</svg>
								<h3
									class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
								>
									About
								</h3>
							</div>

							<div class="p-5">
								<div class="bg-gray-900/50 rounded-lg p-4 text-gray-300 text-sm leading-relaxed">
									{@html user.About_Info || 'No bio available'}
								</div>
							</div>
						</div>

						{#if user.id === currentUser.id}
							<div
								class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden"
							>
								<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-purple-400 mr-2"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
											clip-rule="evenodd"
										/>
									</svg>
									<h3
										class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
									>
										Actions
									</h3>
								</div>

								<div class="p-5 space-y-3">
									<button
										on:click={editProfile}
										class="w-full relative overflow-hidden rounded-lg group"
									>
										<span
											class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
										></span>
										<span
											class="relative px-4 py-3 bg-gray-900/30 backdrop-blur-sm border border-white/10 group-hover:bg-transparent group-hover:border-transparent transition-all duration-300 rounded-lg flex items-center justify-center text-sm font-medium"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 mr-2"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
												/>
											</svg>
											Edit Profile
										</span>
									</button>

									<button
										on:click={Logout}
										class="w-full relative overflow-hidden rounded-lg group"
									>
										<span
											class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
										></span>
										<span
											class="relative px-4 py-3 bg-gray-900/30 backdrop-blur-sm border border-white/10 group-hover:bg-transparent group-hover:border-transparent transition-all duration-300 rounded-lg flex items-center justify-center text-sm font-medium"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 mr-2"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 5a1 1 0 10-2 0v4.3l-1.15-1.15a1 1 0 10-1.4 1.4l3 3a1 1 0 001.4 0l3-3a1 1 0 00-1.4-1.4L12 12.3V8z"
													clip-rule="evenodd"
												/>
											</svg>
											Logout
										</span>
									</button>
								</div>
							</div>
						{/if}

						<!-- Admin badge if applicable -->
						{#if user.Admin}
							<div
								class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-amber-700/30 overflow-hidden"
							>
								<div class="px-5 py-5 bg-gradient-to-r from-amber-900/30 to-amber-800/20">
									<div class="flex items-center">
										<div
											class="flex-shrink-0 h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
													clip-rule="evenodd"
												/>
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
						<div
							class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden"
						>
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-teal-400 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<h3
									class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400"
								>
									Contact Information
								</h3>
							</div>

							<div class="p-5">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<!-- Email card -->
									<div
										class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-blue-500/30 transition-all duration-300"
									>
										<div class="flex items-center">
											<div
												class="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
													/>
													<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
												</svg>
											</div>
											<div class="ml-4">
												<p class="text-sm font-medium text-blue-400">Email Address</p>
												<p class="text-gray-300 font-mono text-sm mt-1 break-all">
													<a href="mailto:{user.Email}" class="hover:underline">{user.Email}</a>
												</p>
											</div>
										</div>
									</div>

									<!-- Phone card -->
									<div
										class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-green-500/30 transition-all duration-300"
									>
										<div class="flex items-center">
											<div
												class="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all duration-300"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
													/>
												</svg>
											</div>
											<div class="ml-4">
												<p class="text-sm font-medium text-green-400">Phone Number</p>
												<p class="text-gray-300 font-mono text-sm mt-1">
													<a href="tel:{user.Phone_Number}" class="hover:underline"
														>{user.Phone_Number || 'Not provided'}</a
													>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Account details -->
						<div
							class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden"
						>
							<div class="px-5 py-4 border-b border-gray-700/50 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-purple-400 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clip-rule="evenodd"
									/>
								</svg>
								<h3
									class="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
								>
									Account Details
								</h3>
							</div>

							<div class="p-5">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<!-- Username card -->
									<div
										class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-purple-500/30 transition-all duration-300"
									>
										<div class="flex flex-col">
											<div class="flex items-center mb-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4 text-purple-400 mr-1"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fill-rule="evenodd"
														d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
														clip-rule="evenodd"
													/>
												</svg>
												<p class="text-sm font-medium text-purple-400">Username</p>
											</div>
											<div class="flex items-center mt-1">
												<span
													class="bg-purple-500/10 text-purple-300 rounded-md px-3 py-1.5 text-sm font-mono border border-purple-500/20"
													>@{user.Username}</span
												>
											</div>
										</div>
									</div>

									<!-- Account type card -->
									<div
										class="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 group hover:border-pink-500/30 transition-all duration-300"
									>
										<div class="flex flex-col">
											<div class="flex items-center mb-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4 text-pink-400 mr-1"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fill-rule="evenodd"
														d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
												<p class="text-sm font-medium text-pink-400">Account Type</p>
											</div>
											<div class="flex items-center mt-1">
												{#if user.Admin}
													<span
														class="bg-yellow-500/10 text-yellow-300 rounded-md px-3 py-1.5 text-sm font-mono border border-yellow-500/20"
														>Administrator</span
													>
												{:else}
													<span
														class="bg-blue-500/10 text-blue-300 rounded-md px-3 py-1.5 text-sm font-mono border border-blue-500/20"
														>Standard User</span
													>
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
			<div
				class="bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-red-900/30 p-8 text-center max-w-lg mx-auto"
			>
				<div
					class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 text-red-400 mb-4"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="text-xl font-bold text-red-400 mb-2">Unable to load profile</h3>
				<p class="text-gray-400 mb-6">
					We couldn't retrieve your profile information. Please try again.
				</p>
				<button
					class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all"
				>
					Refresh Page
				</button>
			</div>
		{/if}

		<!-- Chart  -->
		<div class="max-w-4xl mx-auto mt-5">
			<!-- Glass morphism card with better mobile styling -->
			<div
				class="bg-gray-900/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-purple-800/30 transition-all duration-300"
			>
				<!-- Header with improved mobile layout -->
				<div
					class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0"
				>
					<h2
						class="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
					>
						{#if !isLoading}
							{user?.Username}'s Study Time
						{:else}
							Weekly Study Time
						{/if}
					</h2>

					<!-- Mobile-optimized date range selector -->
					<div
						class="text-gray-400 text-xs sm:text-sm font-medium bg-gray-800/40 py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full border border-gray-700/50 self-start sm:self-auto"
					>
						This Week
					</div>
				</div>

				{#if isLoading}
					<!-- Enhanced Loading State - more compact on mobile -->
					<div
						class="flex flex-col items-center justify-center h-60 sm:h-72 md:h-80 space-y-3 sm:space-y-4"
					>
						<div class="relative h-1.5 w-36 sm:w-48 bg-gray-700/50 rounded-full overflow-hidden">
							<div
								class="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
								style="width: {loadingProgress}%"
							></div>
						</div>
						<p class="text-gray-400 text-xs sm:text-sm font-medium">Loading your study data...</p>
					</div>
				{:else}
					<!-- Stats summary for mobile view -->
					<div class="sm:hidden grid grid-cols-2 gap-2 mb-4">
						<div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/20">
							<span class="text-xs text-gray-400">Average</span>
							<div class="text-lg font-bold text-purple-400">
								{Math.round(
									Object.values(user.Stats[0].Daily_Stats).reduce((a, b) => a + b, 0) /
										Object.values(user.Stats[0].Daily_Stats).length
								)}m
							</div>
						</div>
						<div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/20">
							<span class="text-xs text-gray-400">Peak Day</span>
							<div class="text-lg font-bold text-pink-400">
								{Math.max(...Object.values(user.Stats[0].Daily_Stats))}m
							</div>
						</div>
					</div>

					<!-- Chart with better mobile height -->
					<div class="relative h-56 sm:h-72 md:h-80 -mx-2 sm:mx-0 sm:p-2">
						<canvas id="lineChart"></canvas>
					</div>

					<!-- Generated Response with improved styling -->
					<div
						class="mt-4 sm:mt-6 p-4 sm:p-5 bg-gray-800/30 rounded-lg sm:rounded-xl backdrop-blur-sm border border-purple-900/20 shadow-lg transition-all duration-300"
					>
						<h3 class="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center">
							<span
								class="inline-block w-1 sm:w-1.5 h-5 sm:h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mr-2"
							></span>
							<span
								class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
							>
								{#if !isLoading}
									You vs {user?.Username}
								{:else}
									Study Analysis
								{/if}
							</span>
						</h3>
						<div
							id="generatedResponse"
							class="text-gray-300 text-sm sm:text-base leading-relaxed pl-3.5"
						></div>
					</div>
				{/if}

				<!-- Added footer with tips - more compact on mobile -->
				<div class="mt-4 sm:mt-5 text-2xs sm:text-xs text-gray-500 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-purple-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>Tap or hover over data points for details. Updated daily.</span>
				</div>
			</div>
		</div>
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

	:global(body) {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Ensure the canvas is responsive */
	canvas {
		width: 100% !important;
		height: 100% !important;
	}

	/* Custom text size for extra small screens */
	.text-2xs {
		font-size: 0.65rem;
		line-height: 1rem;
	}

	/* Custom loading animation */
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Enhanced typing animation */
	#generatedResponse::after {
		content: '';
		display: inline-block;
		width: 2px;
		height: 1em;
		background-color: rgba(139, 92, 246, 0.7);
		margin-left: 0.2em;
		vertical-align: text-bottom;
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		from,
		to {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* Improved interactive effects */
	.bg-gray-900\/40 {
		transition: all 0.3s ease-in-out;
	}

	.bg-gray-900\/40:hover {
		box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
		border-color: rgba(139, 92, 246, 0.4);
	}

	/* Mobile optimizations */
	@media (max-width: 640px) {
		.bg-gray-900\/40 {
			background-color: rgba(17, 24, 39, 0.5); /* Slightly darker on mobile */
		}

		/* Improve tap target sizes on mobile */
	}

	/* Add subtle animation to chart container */
	.relative {
		position: relative;
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
