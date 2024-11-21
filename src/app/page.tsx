import UserAuth from '@/components/molecules/UserAuth';
import ChatWindow from '@/components/organisms/ChatWindow';

export default function Home() {
	return (
		<div className='flex items-center flex-row end '>
			<ChatWindow />
			<UserAuth />
		</div>
	);
}
