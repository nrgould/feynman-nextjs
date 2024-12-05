'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import LoaderPage from '@/components/atoms/LoaderPage';
import axios from 'axios';

export default function ChatRedirect() {
	const router = useRouter();
	const { user, isLoading } = useUser();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const createConversation = async () => {
			if (isLoading || loading) return;
			if (!user) {
				// Redirect to login if user is not authenticated
				router.push('/api/auth/login');
				return;
			}

			setLoading(true);
			try {
				// Create a new conversation via API
				const res = await axios.post('/api/conversations', {
					userId: user.sub,
					conceptId: crypto.randomUUID(),
					context: 'Starting a new chat',
					recentMessages: [],
				});

				const conversationId = res.data.conversation._id;
				// Navigate to the new conversation
				router.push(`/chat/${conversationId}`);
			} catch (error) {
				console.error('Error creating conversation:', error);
			} finally {
				setLoading(false);
			}
		};

		createConversation();
	}, [user, router, isLoading, loading]);

	return <LoaderPage />;
}
