import ChatWindow from '@/components/organisms/ChatWindow';

export default function Home() {
	return (
		<div className='flex flex-col h-screen'>
			<h1 className='text-3xl font-semibold mb-4 text-center'>
				Feynman Learning App
			</h1>
			<ChatWindow />
		</div>
	);
}
