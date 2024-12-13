import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DbMessage, Message } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// export const fetcher = async (url: string) => {
// 	const res = await fetch(url);

// 	if (!res.ok) {
// 		const error = new Error(
// 			'An error occurred while fetching the data.'
// 		) as ApplicationError;

// 		error.info = await res.json();
// 		error.status = res.status;

// 		throw error;
// 	}

// 	return res.json();
// };

export function getLocalStorage(key: string) {
	if (typeof window !== 'undefined') {
		return JSON.parse(localStorage.getItem(key) || '[]');
	}
	return [];
}

export function mapDbMessageToMessage(dbMessage: DbMessage): Message {
	return {
		_id: dbMessage._id?.toString(),
		id: dbMessage._id?.toString() || crypto.randomUUID(),
		content: dbMessage.message,
		role: dbMessage.role,
		chatId: dbMessage.chatId,
		userId: dbMessage.userId,
		attachments: dbMessage.attachments,
		created_at: dbMessage.created_at,
	};
}
