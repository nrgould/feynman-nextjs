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
				className={`p-2 max-w-xs md:max-w-md lg:max-w-lg rounded-lg ${
					type === 'user'
						? 'bg-blue-500 text-white'
						: 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
				}`}
			>
				{message}
			</div>
		</div>
	);
}
