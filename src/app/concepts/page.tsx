'use client';

import BarChartMixed from '@/components/molecules/BarChartMixed';
import RadialChart from '@/components/molecules/RadialChart';
import RadialChartShape from '@/components/molecules/RadialChartShape';
import { Button } from '@/components/ui/button';
import { useMessageStore } from '@/store/store';

const Concepts = () => {
	const fetchConversations = useMessageStore(
		(state) => state.fetchConversations
	);

	const handleFetchConversations = () => {
		const conversations = fetchConversations('64f9d9b7c29c3b7f01abc124');
		console.log(conversations);
	};

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
