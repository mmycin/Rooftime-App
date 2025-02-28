<header class="w-full bg-gray-900 border-b border-gray-800 shadow-xl sticky top-0 z-50 mb-4">
	<div class="w-full px-6 sm:px-8 py-3 sm:py-4">
		<div class="flex items-center justify-between">
			
			<!-- Title in the center -->
			<div class="flex items-center flex-grow justify-center select-none">
				<span
					class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 tracking-wide transform -rotate-6 translate-x-2 transition-all duration-300 ease-in-out hover:rotate-0"
				>
					The
				</span>
				<div class="flex flex-col ml-3 sm:ml-4">
					<span
						class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-400 tracking-widest letter-spacing-expanded hover:scale-105 transition-transform duration-300 ease-in-out"
					>
						ROOFTOP
					</span>
					<span
						class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500 tracking-widest letter-spacing-expanded -mt-1 hover:scale-105 transition-transform duration-300 ease-in-out"
					>
						Society
					</span>
				</div>
			</div>

			<!-- Empty div for layout balance -->
			<div class="w-10 sm:w-14"></div>
		</div>
	</div>
</header>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

	:global(body) {
		margin: 0;
		background: linear-gradient(135deg, #0c0515 0%, #110a1f 50%, #000000 100%);
		color: #e4e4e7;
		font-family: 'Poppins', sans-serif;
		min-height: 100vh;
		background-attachment: fixed;
		position: relative;
		overflow-x: hidden;
	}

	/* Header Styling */
	header {
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 2px 6px rgba(0, 0, 0, 0.2);
		background: rgba(13, 13, 18, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		transition: background 0.3s ease-in-out, transform 0.2s;
	}

	/* Custom Letter Spacing */
	.letter-spacing-expanded {
		letter-spacing: 0.3em;
		text-transform: uppercase;
	}

	/* Smooth hover effects */
	span:hover {
		text-shadow: 0 0 20px rgba(217, 70, 239, 0.6);
	}
</style>
