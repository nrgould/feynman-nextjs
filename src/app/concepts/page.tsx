import { Label } from '@/components/ui/label';
import { getConversation } from '../data-access/conversation';
import { getSession } from '@auth0/nextjs-auth0';
import { getMessages } from '../data-access/messages';
import { Message } from '@/store/store';

export default async function Concepts() {
	// const session = await getSession();
	// const conversation = await getConversation('67521ef550c6335e8b87866b');
	// const messages = await getMessages('67521ef550c6335e8b87866b');
	// const user = session?.user || {};

	return (
		<div className='flex flex-col justify-center items-start flex-wrap space-y-4'>
			{/* <div className='flex flex-col'>
				<Label>{user.nickname}</Label>
				<Label>{user.email}</Label>
				<Label>{conversation.context}</Label>
			</div>
			<div className='flex flex-col space-y-2'>
				{messages &&
					messages.map((msg: Message) => (
						<Label key={msg._id}>{msg.message}</Label>
					))}
			</div> */}
		</div>
	);
}
