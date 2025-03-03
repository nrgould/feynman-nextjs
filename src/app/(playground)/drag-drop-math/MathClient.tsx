'use client';

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MathInput } from './MathInput';
import { MathSolutionSidebar } from './MathSolutionSidebar';
import { MathSolutionFlow } from './MathSolutionFlow';
import { MathSolution } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, ArrowRight } from 'lucide-react';

export function MathClient() {
	const [currentSolution, setCurrentSolution] = useState<MathSolution | null>(
		null
	);

	// Handle solution generation from MathInput
	const handleSolutionGenerated = (solution: MathSolution) => {
		setCurrentSolution(solution);
	};

	return (
		<div className='flex flex-col w-full h-[calc(100vh-56px)]'>
			{/* Show MathInput if no solution has been generated yet */}
			{!currentSolution ? (
				<div className='p-6 flex-1 overflow-auto'>
					<div className='max-w-4xl mx-auto'>
						<h1 className='text-2xl font-bold mb-6 flex items-center'>
							<Calculator className='h-6 w-6 mr-2 text-primary' />
							Drag & Drop Math
						</h1>

						<p className='text-muted-foreground mb-8'>
							Enter a math problem and our AI will generate a
							step-by-step solution. Then arrange the steps in the
							correct order by connecting them on the canvas.
						</p>

						<MathInput
							onSolutionGenerated={handleSolutionGenerated}
						/>

						<div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
							<Card>
								<CardContent className='pt-6'>
									<div className='flex items-center text-primary mb-2'>
										<span className='flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2'>
											1
										</span>
										<h3 className='font-medium'>
											Enter a Problem
										</h3>
									</div>
									<p className='text-sm text-muted-foreground'>
										Type in any math problem you need help
										with.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className='pt-6'>
									<div className='flex items-center text-primary mb-2'>
										<span className='flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2'>
											2
										</span>
										<h3 className='font-medium'>
											AI Generates Steps
										</h3>
									</div>
									<p className='text-sm text-muted-foreground'>
										Our AI breaks down the solution into
										logical steps.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className='pt-6'>
									<div className='flex items-center text-primary mb-2'>
										<span className='flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center mr-2'>
											3
										</span>
										<h3 className='font-medium'>
											Arrange the Steps
										</h3>
									</div>
									<p className='text-sm text-muted-foreground'>
										Connect the steps in the correct order
										to test your understanding.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			) : (
				// Show the ReactFlow canvas with the solution
				<div className='flex flex-1 h-full overflow-hidden'>
					<ReactFlowProvider>
						<MathSolutionSidebar mathSolution={currentSolution} />
						<div className='flex-1 flex flex-col h-full overflow-hidden'>
							<div className='p-4 border-b flex items-center justify-between'>
								<h2 className='font-semibold flex items-center'>
									<Calculator className='h-5 w-5 mr-2 text-primary' />
									{currentSolution.title}
								</h2>
								<button
									onClick={() => setCurrentSolution(null)}
									className='text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center'
								>
									<ArrowRight className='h-4 w-4 mr-1' />
									Try Another Problem
								</button>
							</div>
							<div className='flex-1 overflow-hidden'>
								<MathSolutionFlow
									mathSolution={currentSolution}
								/>
							</div>
						</div>
					</ReactFlowProvider>
				</div>
			)}
		</div>
	);
}
