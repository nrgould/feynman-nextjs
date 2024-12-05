import { Label } from '@/components/ui/label';
import { getConversation } from '../data-access/conversation';
import { getSession } from '@auth0/nextjs-auth0';
import { createMessage, getMessages } from '../data-access/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { revalidatePath } from 'next/cache';

export default async function Concepts() {
	const session = await getSession();
	const conversation = await getConversation('67521ef550c6335e8b87866b');
	const messages = await getMessages('67521ef550c6335e8b87866b');
	const user = session?.user || {};

	console.log(messages);
	console.log(user);

	return (
		<div className='flex flex-col justify-center items-start flex-wrap space-y-4'>
			<form
				action={async (formData: FormData) => {
					'use server';
					const message = formData.get('input') as string;
					await createMessage({
						chatId: '67521ef550c6335e8b87866b',
						userId: user.sub,
						message: message,
						sender: 'user',
						created_at: new Date(),
					});
					revalidatePath('/concepts');
				}}
				className='flex flex-row items-start justify-center'
			>
				<Input type='text' name='input' />
				<Button type='submit'>Submit</Button>
			</form>
			<div className='flex flex-col'>
				<Label>{user.nickname}</Label>
				<Label>{user.email}</Label>
				<Label>{conversation.context}</Label>
			</div>
			<div className='flex flex-col space-y-2'>
				{messages &&
					messages.map((msg: Message) => (
						<Label key={msg._id}>{msg.message}</Label>
					))}
			</div>
		</div>
	);
}
