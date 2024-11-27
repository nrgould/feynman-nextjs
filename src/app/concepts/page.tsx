'use client';

import BarChartMixed from '@/components/molecules/BarChartMixed';
import RadialChart from '@/components/molecules/RadialChart';
import RadialChartShape from '@/components/molecules/RadialChartShape';

export function Concepts() {
	return (
		<div className='flex justify-around items-center'>
			<BarChartMixed />
			<RadialChart />
			<RadialChartShape />
		</div>
	);
}

export default Concepts;
