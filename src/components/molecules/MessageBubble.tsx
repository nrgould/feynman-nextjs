interface MessageBubbleProps {
	message: string;
	type: 'user' | 'system';
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
			<div
				className={`px-4 py-1 max-w-xs md:max-w-md lg:max-w-lg rounded-2xl ${
					type === 'user'
						? 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
						: 'text-black dark:text-white'
				}`}
			>
				{message}
			</div>
		</div>
	);
}
