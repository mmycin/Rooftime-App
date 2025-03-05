import axios from 'axios';

export async function Generate(prompt: string, length: number = 80): Promise<string | undefined> {
	const API_KEY = import.meta.env.VITE_COHERE_API_KEY; // Your Cohere API key
	const API_URL = 'https://api.cohere.ai/v1/generate'; // The endpoint for generating text

	const data = {
		model: 'command-r-08-2024', // Model to use
		prompt: prompt, // Your prompt
		max_tokens: length, // Limit the number of tokens (words/characters) returned
		temperature: 0.7 // Adjust creativity of the response
	};

	try {
		const response = await axios.post(API_URL, data, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				'Content-Type': 'application/json'
			}
		});

		// Extract the generated text from the response
		const generatedText = response.data.generations[0].text;
		return generatedText;
	} catch (error) {
		console.error('Error fetching data from Cohere API:', error);
		return;
	}
}
