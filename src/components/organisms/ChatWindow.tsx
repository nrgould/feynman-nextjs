'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useMessageStore } from '@/store/store';
import ChatBar from '../molecules/ChatBar';
import ChatMessages from '../molecules/ChatMessages';

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
				<ChatMessages messages={messages} />
			</div>
			{/* Input area / Chat Bottom */}
			<div className='w-full'>
				<ChatBar
					handleSubmit={handleSubmit}
					loading={loading}
					userInput={userInput}
					setUserInput={setUserInput}
				/>
			</div>
		</div>
	);
}
