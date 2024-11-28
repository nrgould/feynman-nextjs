import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatAvatarProps {
	type: 'user' | 'system';
}

export default function ChatAvatar({ type }: Readonly<ChatAvatarProps>) {
	return (
		<Avatar>
			<AvatarImage
				src={type === 'user' ? '/user-avatar.png' : '/bot-avatar.png'}
				alt={`${type} avatar`}
			/>
			<AvatarFallback>{type === 'user' ? 'U' : 'B'}</AvatarFallback>
		</Avatar>
	);
}
