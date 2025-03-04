<script lang="ts">
	import { onMount } from 'svelte';
	import fetchUser, { type User } from '../../store/User';
	import { goto } from '$app/navigation';

	// @ts-ignore
	import Notify from 'notifier-mycin';
	import { CreateToken } from './Utils/Token';
	import { users as Users } from '../../store/User';
	import { VerifyPassword } from './Utils/HashPass';
	import type { FetchMode } from './Utils/Types';

	let username = '';
	let password = '';
	let errorMessage = '';
	let showPassword = false; // State to toggle password visibility
	let users: User[] = [];

	const handleSubmit = async () => {
		if (!username || !password) {
			errorMessage = 'Username and Password are required.';
			return;
		}

		const user = users.filter(
			(user) => user.Username.toLowerCase().trim() === username.toLowerCase().trim()
		)[0];

		if (user) {
			if (await VerifyPassword(password, user.Password)) {
				const jwt = await CreateToken(user.id);
				user.JWT_Token = jwt;
				const record = await Users.update(user.id, user);
				console.log(record, user);
				localStorage.setItem('token', jwt);
				const mode: FetchMode = "fetch";
				localStorage.setItem("mode", mode);
				goto('/dashboard');
				Notify(`Logged in as ${user.Username}`);
			} else {
				Notify('Invalid Credentials', 3000, 'error');
			}
		}
		errorMessage = ''; // Reset error message
	};

	$: username = username.trim();
	$: password = password.trim();
	// Toggle password visibility
	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	onMount(async () => {
		users = await fetchUser();
	});
</script>

<main class="flex items-center justify-center min-h-screen px-4 py-0 -mt-30 sm:-mt-20">
	<div class="bg-black/60 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md">
		<div class="text-center mb-6">
			<img src="/favicon.png" alt="Logo" class="mx-auto h-24 w-24 object-cover mb-4" />
			<h2 class="text-3xl font-semibold text-white">Welcome Back!</h2>
			<p class="text-gray-300 text-sm">Please log in to continue</p>
		</div>

		{#if errorMessage}
			<div class="mb-4 text-red-500 text-sm">
				<p>{errorMessage}</p>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div class="mb-4">
				<input
					type="text"
					id="username"
					bind:value={username}
					minlength="4"
					maxlength="12"
					placeholder="Username"
					class="w-full px-4 py-3 border border-gray-700 bg-transparent text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
				/>
			</div>

			<div class="mb-6 relative">
				<input
					type={showPassword ? 'text' : 'password'}
					id="password"
					minlength="8"
					maxlength="50"
					bind:value={password}
					placeholder="Password"
					class="w-full px-4 py-3 border border-gray-700 bg-transparent text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
				/>
				<button
					type="button"
					on:click={togglePasswordVisibility}
					class="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
				>
					{#if showPassword}
						<!-- Eye icon when password is visible -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					{:else}
						<!-- Eye icon when password is hidden -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
					{/if}
				</button>
			</div>

			<button
				type="submit"
				class="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
			>
				Log In
			</button>

			<div class="mt-4 text-center">
				<span class="text-sm text-gray-500">
					If you are a member of The Rooftop Society and don't have an account,
					<a
						href="https://www.facebook.com/TahcinKarimMycin/"
						target="_blank"
						class="text-purple-600 cursor-pointer hover:text-purple-700 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
					>
						Click Here
					</a>
					to contact with the admin.
				</span>
			</div>
		</form>
	</div>
</main>
