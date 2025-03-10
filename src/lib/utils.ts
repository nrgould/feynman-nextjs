import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
	CoreAssistantMessage,
	CoreMessage,
	CoreToolMessage,
	Message,
} from 'ai';
import { customAlphabet } from 'nanoid';

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

// sanitize response messages to remove incomplete tool calls
export function sanitizeResponseMessages(
	messages: Array<CoreToolMessage | CoreAssistantMessage>
): Array<CoreToolMessage | CoreAssistantMessage> {
	const toolResultIds: Array<string> = [];

	for (const message of messages) {
		if (message.role === 'tool') {
			for (const content of message.content) {
				if (content.type === 'tool-result') {
					toolResultIds.push(content.toolCallId);
				}
			}
		}
	}

	const messagesBySanitizedContent = messages.map((message) => {
		if (message.role !== 'assistant') return message;

		if (typeof message.content === 'string') return message;

		const sanitizedContent = message.content.filter((content) =>
			content.type === 'tool-call'
				? toolResultIds.includes(content.toolCallId)
				: content.type === 'text'
					? content.text.length > 0
					: true
		);

		return {
			...message,
			content: sanitizedContent,
		};
	});

	return messagesBySanitizedContent.filter(
		(message) => message.content.length > 0
	);
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
	const messagesBySanitizedToolInvocations = messages.map((message) => {
		if (message.role !== 'assistant') return message;

		if (!message.toolInvocations) return message;

		const toolResultIds: Array<string> = [];

		for (const toolInvocation of message.toolInvocations) {
			if (toolInvocation.state === 'result') {
				toolResultIds.push(toolInvocation.toolCallId);
			}
		}

		const sanitizedToolInvocations = message.toolInvocations.filter(
			(toolInvocation) =>
				toolInvocation.state === 'result' ||
				toolResultIds.includes(toolInvocation.toolCallId)
		);

		return {
			...message,
			toolInvocations: sanitizedToolInvocations,
		};
	});

	return messagesBySanitizedToolInvocations.filter(
		(message) =>
			message.content.length > 0 ||
			(message.toolInvocations && message.toolInvocations.length > 0)
	);
}

export function removePointerEventsFromBody() {
	if (document.body.style.pointerEvents === 'none') {
		document.body.style.pointerEvents = '';
	}
}

export const encodeFileAsBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
};

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789');

export function isMultipleOfFive(messages: any[]): boolean {
	return messages.length % 5 === 0;
}
