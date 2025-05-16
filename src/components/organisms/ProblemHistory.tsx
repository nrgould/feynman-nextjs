import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { List } from 'lucide-react';
import { Markdown } from '../atoms/Markdown';

function ProblemHistory({
	showStepsDialog,
	setShowStepsDialog,
	steps,
}: {
	showStepsDialog: boolean;
	setShowStepsDialog: (show: boolean) => void;
	steps: string[];
}) {
	return (
		<Dialog open={showStepsDialog} onOpenChange={setShowStepsDialog}>
			<DialogTrigger asChild>
				<Button
					variant='secondary'
					size='icon'
					className='z-10 absolute right-4 bottom-4 rounded-full p-6'
					onClick={() => setShowStepsDialog(true)}
				>
					<List className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-7/8'>
				<DialogHeader>
					<DialogTitle>Problem History</DialogTitle>
				</DialogHeader>
				{steps && steps.length > 0 ? (
					<ul className='list-decimal list-inside space-y-3 p-4 max-h-[70vh] overflow-y-auto'>
						{steps.map((currentProblemStateString, index) => (
							<li key={index} className='mb-1'>
								<Markdown>{currentProblemStateString}</Markdown>
							</li>
						))}
					</ul>
				) : (
					<p className='p-4 text-center text-muted-foreground'>
						No steps available yet. Start solving the problem!
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default ProblemHistory;
