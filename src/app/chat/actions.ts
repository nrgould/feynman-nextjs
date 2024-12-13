'use server';

import { redirect } from 'next/navigation';
import { saveChat } from '@/lib/db/queries';

export async function createConversationAction(formData: FormData) {
	const userId = formData.get('userId') as string;

	const conversation = await saveChat({ userId });

	redirect(`/chat/${conversation._id}`);
}
