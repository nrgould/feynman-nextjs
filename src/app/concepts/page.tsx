'use client';

import MessageBubble from '@/components/molecules/MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { CircleStopIcon, SendIcon } from 'lucide-react';

export default function Concepts() {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		stop,
		error,
	} = useChat({
		api: '/api/chat',
	});

	return (
		<div className='flex flex-col gap-4 items-center justify-center'>
			{messages.map((m, i) => (
				<MessageBubble key={m.id} message={m.content} role={m.role} />
			))}
			<form onSubmit={handleSubmit} className='flex gap-4'>
				<Input value={input} onChange={handleInputChange} />
				<Button type='submit'>
					{isLoading ? <CircleStopIcon /> : <SendIcon />}
				</Button>
			</form>
		</div>
	);
}
