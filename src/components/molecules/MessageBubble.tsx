import SystemMessage from '../atoms/SystemMessage';
import UserMessage from '../atoms/UserMessage';

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
