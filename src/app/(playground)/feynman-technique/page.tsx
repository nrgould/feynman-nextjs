import React from 'react';
import Chat from './input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FeynmanTechnique() {
	return (
		<ScrollArea className='h-screen'>
			<div className='container mx-auto px-4 py-8 pb-48'>
				<div className='text-center space-y-2 mb-8'>
					<h1 className='text-4xl font-bold'>AI Feynman Technique</h1>
					<p className='text-xl text-muted-foreground'>
						Assess your competency on any concept
					</p>
				</div>
				<div className='max-w-3xl mx-auto'>
					<Chat />
				</div>
			</div>
		</ScrollArea>
	);
}
