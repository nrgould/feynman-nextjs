'use client';

import BarChartMixed from '@/components/molecules/BarChartMixed';
import RadialChart from '@/components/molecules/RadialChart';
import RadialChartShape from '@/components/molecules/RadialChartShape';
import { Button } from '@/components/ui/button';
import { useMessageStore } from '@/store/store';

const Concepts = () => {
	const saveConversation = useMessageStore((state) => state.saveConversation);
	const fetchConversations = useMessageStore(
		(state) => state.fetchConversations
	);

	const handleFetchConversations = () => {
		const conversations = fetchConversations('64f9d9b7c29c3b7f01abc124');
		console.log(conversations);
	};

	saveConversation({
		userId: '64f9d9b7c29c3b7f01abc124',
		conceptId: '64f9d9b7c29c3b7f01abc125',
		context: 'Understanding basic algebraic factoring',
		messages: [
			{
				id: '1732248373494',
				sender: 'user',
				message: 'Can you explain basic factoring?',
				timestamp: new Date('2023-10-01T10:30:00Z'), // Parse the string into a Date object
			},
			{
				id: '1732248373495',
				sender: 'system',
				message:
					'Sure! Factoring involves expressing a mathematical expression as a product of its factors.',
				timestamp: new Date('2023-10-01T10:30:05Z'),
			},
			{
				id: '1732248373496',
				sender: 'user',
				message: 'Can you give an example?',
				timestamp: new Date('2023-10-01T10:31:00Z'),
			},
			{
				id: '1732248373497',
				sender: 'system',
				message:
					'Of course! For x^2 + 5x + 6, the factors are (x + 2)(x + 3).',
				timestamp: new Date('2023-10-01T10:31:10Z'),
			},
		],
	});

	return (
		<div className='flex justify-around items-center flex-wrap space-x-4 space-y-4'>
			<Button onClick={handleFetchConversations}>
				Fetch Conversations
			</Button>
			{/* <BarChartMixed />
			<RadialChart />
			<RadialChartShape /> */}
		</div>
	);
};

export default Concepts;
