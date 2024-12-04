'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import LoaderPage from '@/components/atoms/LoaderPage';
import { useMessageStore } from '@/store/store';

export default function ChatRedirect() {
	const router = useRouter();
	const { user, isLoading } = useUser();

	const setConversation = useMessageStore((state) => state.setConversation);

	useEffect(() => {
		const createConversation = async () => {
			if (isLoading) return; // Wait for user state
			if (!user) {
				// Redirect to login if user is not authenticated
				router.push('/api/auth/login');
				return;
			}

			try {
				// Create a new conversation via API
				const res = await axios.post('/api/conversations', {
					userId: user.sub,
					conceptId: crypto.randomUUID(),
					context: 'Starting a new chat',
					recentMessages: [],
				});

				setConversation(res.data.conversation);
				const conversationId = res.data.conversation._id;
				// Navigate to the new conversation
				router.push(`/chat/${conversationId}`);
			} catch (error) {
				console.error('Error creating conversation:', error);
				// Handle error, e.g., show an error message
			}
		};

		createConversation();
	}, [isLoading, user, router]);

	return <LoaderPage />;
}
