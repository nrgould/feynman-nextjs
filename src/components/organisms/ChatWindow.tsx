'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import axios from 'axios';
import { useMessageStore } from '@/store/store';
import ChatBar from '../molecules/ChatBar';
import ChatMessages from '../molecules/ChatMessages';
import { ToastAction } from '@radix-ui/react-toast';
import { toast } from '@/hooks/use-toast';

interface ApiResponse {
	result: string;
}

export default function ChatWindow() {
	const [userInput, setUserInput] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const messages = useMessageStore((state) => state.messages);
	const addMessage = useMessageStore((state) => state.addMessage);

	useEffect(() => {
		console.log(messages);
	}, [loading, messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

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
			scrollToBottom();
		} catch (error) {
			console.error('Error fetching response:', error);

			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with your request.',
				action: (
					<ToastAction altText='Try again'>Try again</ToastAction>
				),
			});

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
		<div className='relative flex flex-col lg:items-center md:items-baseline sm:items-baseline justify-center lg:px-24 md:px-8 sm:px-2 xs:px-0 w-full'>
			{/* Messages Area / Chat Middle */}
			<div className='pb-12 md:w-full'>
				<ChatMessages messages={messages} loading={loading} />
				<div style={{ marginBottom: 100 }} ref={messagesEndRef} />
			</div>

			{/* Input area / Chat Bottom */}
			<div className='fixed bottom-0 w-full'>
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
