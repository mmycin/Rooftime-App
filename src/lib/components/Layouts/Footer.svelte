<footer class="fixed bottom-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 shadow-lg z-40">
	<nav class="flex justify-around items-center py-3 px-4 sm:py-4 sm:px-6 max-w-4xl mx-auto">
		<!-- Home -->
		<a href="/" class="nav-item group">
			<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
				<polyline points="9 22 9 12 15 12 15 22"></polyline>
			</svg>
			<span class="nav-text">Home</span>
		</a>
		<!-- Timer -->
		<a href="/timer" class="nav-item group">
			<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"></circle>
				<polyline points="12 6 12 12 16 14"></polyline>
			</svg>
			<span class="nav-text">Timer</span>
		</a>
		<!-- Score Board -->
		<a href="/scoreboard" class="nav-item group">
			<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 3v17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1z"></path>
				<line x1="8" y1="10" x2="16" y2="10"></line>
				<line x1="8" y1="14" x2="16" y2="14"></line>
				<line x1="8" y1="18" x2="12" y2="18"></line>
				<rect x="10" y1="6" width="4" height="4" rx="1"></rect>
			</svg>
			<span class="nav-text">Score</span>
		</a>
		<!-- Performance -->
		<a href="/performance" class="nav-item group">
			<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
				<path d="M15.9 11a4 4 0 1 1-7.8 0M12 8v4l2 2"></path>
			</svg>
			<span class="nav-text">Stats</span>
		</a>
		<!-- Account -->
		<a href="/profile" class="nav-item group">
			<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
				<circle cx="12" cy="7" r="4"></circle>
			</svg>
			<span class="nav-text">Profile</span>
		</a>
	</nav>
</footer>

<style>
	footer {
		background: linear-gradient(to right, rgba(13, 13, 18, 0.95), rgba(18, 13, 23, 0.95));
		backdrop-filter: blur(10px);
		box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
		height: auto;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #a1a1aa;
		font-size: 0.75rem;
		text-decoration: none;
		padding: 8px 0;
		width: 20%;
		position: relative;
		transition: all 0.3s;
	}

	.nav-item::after {
		content: "";
		position: absolute;
		bottom: -3px;
		width: 0;
		height: 3px;
		background: linear-gradient(to right, #c084fc, #e879f9);
		border-radius: 10px;
		transition: width 0.3s ease;
		left: 50%;
		transform: translateX(-50%);
	}

	.nav-item:hover {
		color: #e4e4e7;
	}

	.nav-item:hover::after {
		width: 60%;
	}

	.nav-icon {
		width: 20px;
		height: 20px;
		stroke: #ffffff; /* Lighter white color */
		margin-bottom: 4px;
		transition: all 0.3s ease;
	}

	.nav-item:hover .nav-icon {
		transform: translateY(-2px);
		color: #c084fc;
	}

	.nav-text {
		transition: all 0.3s ease;
		font-weight: 500;
	}

	.nav-item:hover .nav-text {
		transform: translateY(2px);
	}

	/* Active state styling */

	@media (min-width: 640px) {
		.nav-item {
			font-size: 0.85rem;
			padding: 10px 0;
		}

		.nav-icon {
			width: 24px;
			height: 24px;
			margin-bottom: 6px;
		}
	}

	@media (max-width: 360px) {
		.nav-text {
			font-size: 0.7rem;
		}

		.nav-icon {
			width: 18px;
			height: 18px;
			margin-bottom: 3px;
		}
	}
</style>
