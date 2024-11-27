import SystemMessage from '../atoms/SystemMessageBubble';
import UserMessage from '../atoms/UserMessageBubble';

interface MessageBubbleProps {
	message: string;
	type: 'user' | 'system';
}

export default function MessageBubble({
	message,
	type,
}: Readonly<MessageBubbleProps>) {
	return type === 'user' ? (
		<UserMessage message={message} />
	) : (
		<SystemMessage message={message} />
	);
}
