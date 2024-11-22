'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import MessageBubble from '@/components/molecules/MessageBubble';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Input } from '../ui/input';
import { useMessageStore } from '@/store/store';

interface ApiResponse {
	result: string;
}

export default function ChatWindow() {
	const [userInput, setUserInput] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const messages = useMessageStore((state) => state.messages);
	const addMessage = useMessageStore((state) => state.addMessage);

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messages]);

	useEffect(() => {
		console.log(messages);
	}, [loading]);

	// const scrollToBottom = () => {
	// 	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// };

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		// Add user message to Zustand store
		addMessage({
			id: Date.now().toString(),
			type: 'user',
			text: userInput,
		});
		// console.log('Message added:', {
		// 	id: Date.now().toString(),
		// 	type: 'user',
		// 	text: userInput,
		// });
		setLoading(true);
		setUserInput('');

		try {
			const res = await axios.post<ApiResponse>('/api/chatgpt', {
				userInput,
				context: messages.slice(0, -1),
			});

			// Add system message to Zustand store
			addMessage({
				id: Date.now().toString(),
				type: 'system',
				text: res.data.result,
			});
		} catch (error) {
			console.error('Error fetching ChatGPT response:', error);

			// Add error message to Zustand store
			addMessage({
				id: Date.now().toString(),
				type: 'system',
				text: 'There was an error. Please try again.',
			});
		}
		setLoading(false);
	};

	return (
		<div className='flex flex-col h-full'>
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
				<div className='fixed bottom-0 left-0 right-0 mx-auto max-w-lg'>
					<form onSubmit={handleSubmit} className='p-4'>
						<div className='flex items-center space-x-2'>
							<Input
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
								placeholder='Type a message...'
								className='max-w-xs'
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
			</div>
		</div>
	);
}
