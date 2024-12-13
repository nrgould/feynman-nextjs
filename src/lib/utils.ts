import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DbMessage, Message } from '@/lib/types';
import { CoreMessage } from 'ai';

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

export function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
	const userMessages = messages.filter((message) => message.role === 'user');
	return userMessages.at(-1);
}

export function mapDbMessageToMessage(dbMessage: DbMessage): Message {
	const { _id, role, chatId, userId, content, attachments, created_at } =
		dbMessage;
	return {
		_id: _id?.toString(),
		id: _id?.toString() || crypto.randomUUID(),
		content,
		role,
		chatId,
		userId,
		attachments,
		created_at,
	};
}
