'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import axios from 'axios';
import { useMessageStore } from '@/store/store';
import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { ToastAction } from '@radix-ui/react-toast';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import LoaderPage from '@/components/atoms/LoaderPage';

interface ApiResponse {
	result: string;
}

export default function ChatWindow({ params }: { params: { id: string } }) {
	const [userInput, setUserInput] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { user, error, isLoading } = useUser();

	const messages = useMessageStore((state) => state.messages);
	const addMessage = useMessageStore((state) => state.addMessage);
	const clearMessages = useMessageStore((state) => state.clearMessages);
	const fetchConversationById = useMessageStore(
		(state) => state.fetchConversationById
	);

	useEffect(() => {
		const fetchConversation = async () => {
			const conversationId = params.id;

			try {
				await fetchConversationById(conversationId);
				console.log('Conversation fetched successfully');
			} catch (error) {
				console.error('Error fetching conversation:', error);
				toast({
					variant: 'destructive',
					title: 'Error fetching conversation',
					description: 'Failed to load the conversation.',
					action: (
						<ToastAction altText='Try again'>Try again</ToastAction>
					),
				});
			}
		};

		fetchConversation();

		return () => {
			clearMessages();
		};
	}, [fetchConversationById, params.id, clearMessages]);

	if (isLoading) return <LoaderPage />;
	if (error) return <div>{error.message}</div>;
	if (!user)
		return (
			<Link href='/api/auth/login'>
				<a>Login</a>
			</Link>
		);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		if (!user?.sub) {
			throw new Error('User ID is missing');
		}

		// Add user message to Zustand store
		addMessage({
			chatId: params.id,
			userId: user.sub,
			id: crypto.randomUUID(),
			sender: 'user',
			message: userInput,
			created_at: new Date(),
		});
		setLoading(true);
		setUserInput('');

		try {
			// const res = await axios.post<ApiResponse>('/api/chatgpt', {
			// 	userInput,
			// 	context: messages.slice(0, -1), //this should be replaced with summarized context from GPT3.5
			// });
			// // Add system message to Zustand store and mongodb
			// addMessage({
			// 	userId: user?.sub,
			// 	id: Date.now().toString(),
			// 	sender: 'system',
			// 	message: res.data.result,
			// 	created_at: new Date(),
			// });
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
			<div className='fixed bottom-0 left-0 w-full'>
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
