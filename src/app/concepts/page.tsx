import BarChartMixed from '@/components/molecules/BarChartMixed';
import RadialChart from '@/components/molecules/RadialChart';
import RadialChartShape from '@/components/molecules/RadialChartShape';

const Concepts = () => {
	return (
		<div className='flex justify-around items-center flex-wrap space-x-4 space-y-4'>
			<BarChartMixed />
			<RadialChart />
			<RadialChartShape />
		</div>
	);
};

export default Concepts;
