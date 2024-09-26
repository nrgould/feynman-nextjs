'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import MessageBubble from '@/components/molecules/MessageBubble';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Input } from '../ui/input';

interface ApiResponse {
	result: string;
}

export default function ChatWindow() {
	const [messages, setMessages] = useState<{ type: string; text: string }[]>(
		[]
	);
	const [userInput, setUserInput] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		setMessages((prev) => [...prev, { type: 'user', text: userInput }]);
		setLoading(true);
		setUserInput('');

		try {
			const res = await axios.post<ApiResponse>('/api/chatgpt', {
				userInput,
			});
			setMessages((prev) => [
				...prev,
				{ type: 'bot', text: res.data.result },
			]);
		} catch (error) {
			console.error('Error fetching ChatGPT response:', error);
			setMessages((prev) => [
				...prev,
				{ type: 'bot', text: 'There was an error. Please try again.' },
			]);
		}

		setLoading(false);
	};

	return (
		<div className='flex-1 overflow-y-auto p-4 space-y-4'>
			{messages.map((message, index) => (
				<MessageBubble
					key={index}
					message={message.text}
					type={message.type}
				/>
			))}

			{loading && (
				<div className='self-start'>
					<Skeleton className='h-8 w-24 bg-gray-300 dark:bg-gray-700' />
				</div>
			)}

			<div ref={messagesEndRef} />

			{/* Input area */}
			<form
				onSubmit={handleSubmit}
				className='p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800'
			>
				<div className='flex items-center space-x-2'>
					<Input
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						placeholder='Type a message...'
						className='flex-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
					/>
					<Button
						type='submit'
						disabled={loading || !userInput.trim()}
					>
						{loading ? 'Sending...' : 'Send'}
					</Button>
				</div>
			</form>
		</div>
	);
}
