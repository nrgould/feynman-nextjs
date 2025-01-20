'use client';

import SystemMessage from '../atoms/SystemMessageBubble';
import UserMessage from '../atoms/UserMessageBubble';

interface MessageBubbleProps {
	message: string;
	role: 'user' | 'system' | 'assistant' | 'data';
}

export default function MessageBubble({
	message,
	role,
}: Readonly<MessageBubbleProps>) {
	console.log(message);
	return <div>{message}</div>;
	// return role === 'user' ? (
	// 	<UserMessage message={message} />
	// ) : (
	// 	<SystemMessage message={message} />
	// );
}
