'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// Define the structure of the API response
interface ApiResponse {
	result: string;
}

export default function Home() {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const [userInput, setUserInput] = useState<string>('');
	const [response, setResponse] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	// On initial load, check the local storage for the theme preference
	useEffect(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme === 'dark') {
			document.documentElement.classList.add('dark');
			setIsDarkMode(true);
		}
	}, []);

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
		if (!isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	// Handle form submission to send user input to ChatGPT API
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setResponse('');

		try {
			const res = await axios.post<ApiResponse>('/api/chatgpt', {
				userInput,
			});
			setResponse(res.data.result);
		} catch (error) {
			console.error('Error fetching the response:', error);
			setResponse('There was an error. Please try again.');
		}

		setLoading(false);
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'>
			<div className='p-6 max-w-lg w-full mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg'>
				<h1 className='text-3xl font-semibold mb-4 text-center text-black dark:text-white'>
					Feynman Learning App
				</h1>

				{/* Dark Mode Toggle Button */}
				<div className='text-center mb-4'>
					<Button onClick={toggleDarkMode}>
						{isDarkMode
							? 'Switch to Light Mode'
							: 'Switch to Dark Mode'}
					</Button>
				</div>

				{/* Form for User Input */}
				<form onSubmit={handleSubmit}>
					<Textarea
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						placeholder='Explain a concept...'
						className='mb-4 w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
						rows={5}
					/>

					<Button
						type='submit'
						disabled={loading || !userInput}
						className='w-full'
					>
						{loading ? 'Processing...' : 'Submit'}
					</Button>
				</form>

				{/* Display the Response from ChatGPT */}
				{response && (
					<div className='mt-6 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white'>
						<h2 className='text-xl font-semibold mb-2'>
							ChatGPT Feedback:
						</h2>
						<p>{response}</p>
					</div>
				)}
			</div>
		</div>
	);
}
