import { MathClient } from './MathClient';

export const dynamic = 'force-dynamic';

export default function DragDropMathPage() {
	return (
		<div className='min-h-[calc(100vh-56px)] h-[calc(100vh-56px)] flex flex-col relative overflow-hidden'>
			{/* Main content */}
			<MathClient />
		</div>
	);
}
