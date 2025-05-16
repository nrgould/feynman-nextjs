import React from 'react';
import { Markdown } from '../atoms/Markdown';
import { Button } from '../ui/button';

function MethodList({
	methods,
	generateMoreMethods,
	appendProblem,
}: {
	methods: string[];
	generateMoreMethods: () => void;
	appendProblem: (method: string) => void;
}) {
	return (
		<div className='flex flex-col gap-4 items-center'>
			<h2 className='text-sm md:text-xl font-semibold my-2 text-center'>
				Choose a method to solve the problem
			</h2>
			<div className='grid grid-cols-2 gap-2 w-full md:w-1/2'>
				{methods.map((method, index) => (
					<Button
						size='lg'
						key={index}
						variant='outline'
						className='py-12 text-wrap px-2'
						onClick={() => appendProblem(method)}
					>
						<Markdown>{method}</Markdown>
					</Button>
				))}
			</div>
			<Button variant='ghost' onClick={generateMoreMethods}>
				Preferred method not here
			</Button>
		</div>
	);
}

export default MethodList;
