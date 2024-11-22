'use client';

import { useState, useEffect, FormEvent } from 'react';
import MessageBubble from '@/components/molecules/MessageBubble';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Input } from '../ui/input';
import { useMessageStore } from '@/store/store';
import ScrollToBottom from 'react-scroll-to-bottom';

interface ApiResponse {
	result: string;
}

export default function ChatWindow() {
	const [userInput, setUserInput] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const messages = useMessageStore((state) => state.messages);
	const addMessage = useMessageStore((state) => state.addMessage);

	useEffect(() => {
		console.log(messages);
	}, [loading, messages]);

	//this functionality should be at the page level
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		// Add user message to Zustand store
		addMessage({
			id: Date.now().toString(),
			type: 'user',
			text: userInput,
		});
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
		<div className='h-full flex flex-col scrollbar-hidden'>
			{/* Chat Top */}
			<div></div>

			{/* Messages Area / Chat Middle */}
			<div className=''>
				<div className=''>
					<ScrollToBottom className='flex-1'>
						{messages.map((message, index) => (
							<MessageBubble
								key={index}
								message={message.text}
								type={message.type}
							/>
						))}

						{loading && (
							<div className='self-start'>
								<Skeleton className='h-8 w-1/4 bg-gray-300 dark:bg-gray-700' />
							</div>
						)}
					</ScrollToBottom>
				</div>
			</div>
			{/* Input area / Chat Bottom */}
			<div className='w-full'>
				<div className='grow md:mr-5 xs:mr-4 self-end'>
					<form onSubmit={handleSubmit} className='relative flex'>
						<Input
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							placeholder='Type a message...'
							className='max-h-[5rem] pr-[3.125rem] resize-none scrollbar-hidden'
						/>
						<Button
							type='submit'
							disabled={loading || !userInput.trim()}
						>
							{loading ? 'Sending...' : 'Send'}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
