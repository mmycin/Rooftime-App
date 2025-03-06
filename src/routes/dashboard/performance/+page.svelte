<script>
	// @ts-nocheck
	import { onMount, afterUpdate } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import CurrentUser from '$lib/Utils/FetchUser';
	import { Generate } from '$lib/Utils/AI_Chat';
	import Typed from 'typed.js';
	import { objectLength } from '$lib/Utils/Leaderboard';

	// Register Chart.js components
	Chart.register(...registerables);

	let currentUser;
	let isLoading = true;
	let chart;
	let generatedResponse = '';
	let typedInstance;
	let loadingProgress = 0;
	let windowWidth;
	let isMobile = false;

	let lenData;

	// Track window resize for responsive adjustments
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

	// Create the chart with proper responsiveness
	const createChart = () => {
		if (!currentUser || isLoading) return;
		// Extract daily stats data
		const dailyStats = currentUser.Stats[0].Daily_Stats;
		lenData = objectLength(dailyStats);
		console.log(lenData);
		// Prepare data for Chart.js
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const labels = Object.keys(dailyStats).map((key) => daysOfWeek[parseInt(key) - 1]);
		const data = Object.values(dailyStats);

		const obj = {
			labels: labels,
			data: data
		};

		// Responsively adjust font sizes and point sizes
		const isMobileView = window.innerWidth < 640;
		const pointRadius = isMobileView ? 4 : 6;
		const borderWidth = isMobileView ? 2 : 3;
		const fontSize = isMobileView ? 11 : 12;

		// Create the chart with improved styling
		const ctx = document.getElementById('lineChart').getContext('2d');

		if (chart) {
			chart.destroy();
		}

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Study Time (minutes)',
						data: data,
						borderColor: 'rgba(139, 92, 246, 1)',
						backgroundColor: 'rgba(139, 92, 246, 0.15)',
						borderWidth: borderWidth,
						pointRadius: pointRadius,
						pointBackgroundColor: 'rgba(255, 255, 255, 1)',
						pointBorderColor: 'rgba(139, 92, 246, 1)',
						pointBorderWidth: 2,
						pointHoverRadius: pointRadius + 2,
						pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
						pointHoverBorderColor: 'rgba(167, 139, 250, 1)',
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
						display: !isMobileView, // Hide legend on mobile
						position: 'top',
						align: 'end',
						labels: {
							boxWidth: 12,
							usePointStyle: true,
							pointStyle: 'circle',
							color: '#E5E7EB',
							font: {
								size: fontSize + 1,
								family: "'Inter', sans-serif",
								weight: '500'
							},
							padding: isMobileView ? 10 : 15
						}
					},
					tooltip: {
						enabled: true,
						backgroundColor: 'rgba(17, 24, 39, 0.95)',
						titleColor: '#E5E7EB',
						bodyColor: '#E5E7EB',
						borderColor: 'rgba(139, 92, 246, 0.7)',
						borderWidth: 1,
						cornerRadius: 8,
						padding: isMobileView ? 8 : 12,
						boxPadding: 6,
						usePointStyle: true,
						titleFont: {
							size: fontSize + 1,
							family: "'Inter', sans-serif",
							weight: 'bold'
						},
						bodyFont: {
							size: fontSize,
							family: "'Inter', sans-serif"
						},
						callbacks: {
							title: function (tooltipItems) {
								return tooltipItems[0].label;
							},
							label: function (context) {
								return `  ${context.parsed.y} minutes`;
							}
						}
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							color: '#9CA3AF',
							font: {
								size: fontSize,
								family: "'Inter', sans-serif"
							},
							padding: isMobileView ? 5 : 8, // Reduced padding for mobile
							maxRotation: isMobileView ? 45 : 0 // Rotate labels on mobile
						},
						border: {
							display: false
						}
					},
					y: {
						grid: {
							color: 'rgba(255, 255, 255, 0.06)',
							drawTicks: false,
							drawBorder: false,
							lineWidth: isMobileView ? 0.5 : 1 // Thinner lines on mobile
						},
						ticks: {
							color: '#9CA3AF',
							font: {
								size: fontSize,
								family: "'Inter', sans-serif"
							},
							padding: isMobileView ? 8 : 10,
							stepSize: isMobileView ? 60 : 30, // Larger steps on mobile
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
					padding: {
						top: 10,
						right: isMobileView ? 5 : 20,
						bottom: 0,
						left: isMobileView ? 5 : 10
					}
				},
				interaction: {
					mode: 'index',
					intersect: false
				},
				elements: {
					line: {
						capBezierPoints: true
					}
				}
			}
		});
	};

	onMount(async () => {
		// Set up window resize listener
		window.addEventListener('resize', handleResize);
		handleResize(); // Initial check

		// Start progress animation
		const progressInterval = incrementProgress();

		try {
			// Fetch current user data
			currentUser = await CurrentUser();

			// Complete progress bar
			loadingProgress = 100;

			// Small delay to show complete progress
			setTimeout(() => {
				isLoading = false;
				clearInterval(progressInterval);
			}, 500);
		} catch (error) {
			console.error('Error loading data:', error);
			clearInterval(progressInterval);
			isLoading = false;
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			if (chart) {
				chart.destroy();
			}
		};
	});

	// Use afterUpdate to ensure the canvas element is available
	afterUpdate(async () => {
		if (!isLoading && !chart && currentUser) {
			createChart();

			const dailyStats = currentUser.Stats[0].Daily_Stats;
			const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			const labels = Object.keys(dailyStats).map((key) => daysOfWeek[parseInt(key) - 1]);
			const data = Object.values(dailyStats);

			const obj = {
				labels: labels,
				data: data
			};

			const prompt = `
                Analyze my daily study time for this week (in minutes), provided as an object where the keys represent
                days of the week and values represent study duration. Provide a detailed, data-driven analysis 
                focusing on the following aspects:
                
                1. Evaluation & Insights
                    - Assess my study time objectively—Is it sufficient for an H.S.C. candidate in Bangladesh?
                    - Identify strengths and weaknesses in my study pattern.
                    - Highlight any inconsistencies, trends, or areas that need adjustment.

                2. Suggestions for Improvement
                    - Recommend strategies to enhance my study habits without burnout.
                    - Suggest optimal study durations for an H.S.C. student aiming for academic excellence.
                    - Provide techniques to maintain consistency and maximize focus.

                3. Predictions Based on Data
                    - Forecast how much I am likely to study tomorrow based on the current trend.
                    - Estimate my average study time for next week if my current pattern continues.

                4. Comparative Analysis
                    - Compare my study duration with ideal study recommendations for an H.S.C. student.
                    - Discuss how top-performing students manage their study schedules.
                    - Provide practical benchmarks for improvement.

                5. Concise Summary
                    - Deliver all insights in a structured yet concise format (preferably under 300 characters).

                Here is the data:
                ${JSON.stringify(obj)}

                Analyze my weekly study time (in minutes) from the provided data, evaluating if it is sufficient 
                for an H.S.C. candidate in Bangladesh. Identify strengths, weaknesses, trends, and inconsistencies. 
                Provide actionable strategies to improve my study habits. Predict my study time for tomorrow and next 
                week's average based on current patterns. Compare my study duration with ideal benchmarks for 
                top-performing H.S.C. students. Keep insights concise and under 300 characters.

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

<svelte:window on:resize={handleResize} />


<!-- {#if lenData > 0} -->
<main class="min-h-screen text-white px-3 py-4 sm:p-4 font-sans sm:mb-20">
	<div class="max-w-4xl mx-auto">
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
					Weekly Study Time
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
								Object.values(currentUser.Stats[0].Daily_Stats).reduce((a, b) => a + b, 0) /
									Object.values(currentUser.Stats[0].Daily_Stats).length
							) || 0}m
						</div>
					</div>
					<div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/20">
						<span class="text-xs text-gray-400">Peak Day</span>
						<div class="text-lg font-bold text-pink-400">
							{Math.max(...Object.values(currentUser.Stats[0].Daily_Stats)) === -Infinity ? 0 : Math.max(...Object.values(currentUser.Stats[0].Daily_Stats))}m
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
							Your Weekly Feedback
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
<!-- {:else}
	<!-- No Data Available Message with Better Styling -->
	<!-- <div class="min-h-screen flex flex-col justify-center items-center text-center">
		<h1 class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
			No Data Available
		</h1>
		<p class="text-gray-400 mt-2 text-sm sm:text-base">
			There is no study data recorded for this week. Start tracking your progress now!
		</p>
	</div>
{/if} --> 

<style>
	/* Base font */
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
