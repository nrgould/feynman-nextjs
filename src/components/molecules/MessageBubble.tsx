import { Card } from '@/components/ui/card';
import ChatAvatar from '@/components/atoms/Avatar';

interface MessageBubbleProps {
	message: string;
	type: 'user' | 'bot';
}

export default function MessageBubble({
	message,
	type,
}: Readonly<MessageBubbleProps>) {
	return (
		<div
			className={`flex ${
				type === 'user' ? 'justify-end' : 'justify-start'
			} items-start space-x-2`}
		>
			{type === 'bot' && <ChatAvatar type='bot' />}
			<Card
				className={` p-2 max-w-xs md:max-w-md lg:max-w-lg ${
					type === 'user'
						? 'bg-blue-500 text-white'
						: 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
				}`}
			>
				{message}
			</Card>
			{type === 'user' && <ChatAvatar type='user' />}
		</div>
	);
}
