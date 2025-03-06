'use client';

import { useState, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MathInput } from './MathInput';
import { MathSolutionSidebar } from './MathSolutionSidebar';
import { MathSolutionFlow, MathSolutionFlowHandle } from './MathSolutionFlow';
import { MathSolution, MathEdge, VerificationResult, MathStep } from './types';
import { useMathHistoryStore } from '@/store/math-history-store';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, ArrowRight } from 'lucide-react';
import { MathGamificationBadge } from './MathGamificationDisplay';

export function MathClient() {
	const [mathSolution, setMathSolution] = useState<MathSolution | null>(null);
	const [edges, setEdges] = useState<MathEdge[]>([]);
	const [verificationResult, setVerificationResult] =
		useState<VerificationResult | null>(null);
	const [grade, setGrade] = useState<number | null>(null);
	const [solutionCorrect, setSolutionCorrect] = useState<boolean>(false);
	const [placedSteps, setPlacedSteps] = useState<string[]>([]);

	// Reference to the MathSolutionFlow component
	const mathSolutionFlowRef = useRef<MathSolutionFlowHandle>(null);

	// Access the math history store
	const { updateSession } = useMathHistoryStore();

	// Handle edges update from MathSolutionFlow
	const handleEdgesUpdate = (updatedEdges: MathEdge[]) => {
		setEdges(updatedEdges);
	};

	// Handle verification result update from MathSolutionFlow
	const handleVerificationUpdate = (
		result: VerificationResult,
		calculatedGrade: number
	) => {
		setVerificationResult(result);
		setGrade(calculatedGrade);
		setSolutionCorrect(result.isCorrect);

		// Update the session in history with verification results
		if (mathSolution && mathSolution.id) {
			updateSession(mathSolution.id, {
				verificationResult: result,
				grade: calculatedGrade,
			});
		}
	};

	// Function to trigger verification from outside the MathSolutionFlow
	const triggerVerification = () => {
		if (mathSolutionFlowRef.current) {
			mathSolutionFlowRef.current.verifyCurrentSolution();
		}
	};

	// Function to reset all steps back to the sidebar
	const resetSteps = () => {
		if (mathSolutionFlowRef.current) {
			mathSolutionFlowRef.current.resetCanvas();
		}
	};

	// Handle drag start event for steps
	const handleDragStart = (
		event: React.DragEvent<HTMLDivElement>,
		step: MathStep
	) => {
		// Set the drag data to the step object
		event.dataTransfer.setData('application/json', JSON.stringify(step));
		event.dataTransfer.effectAllowed = 'move';
	};

	// Handle placed steps change
	const handlePlacedStepsChange = (stepIds: string[]) => {
		setPlacedSteps(stepIds);
	};

	return (
		<div className='flex flex-col w-full h-[calc(100vh-56px)]'>
			{/* Show MathInput if no solution has been generated yet */}
			{!mathSolution ? (
				<div className='p-6 flex-1 overflow-auto'>
					<div className='max-w-4xl mx-auto'>
						<Card className='mb-6'>
							<CardContent className='p-6'>
								<h1 className='text-2xl font-bold mb-2 flex items-center'>
									<Calculator className='h-6 w-6 mr-2 text-primary' />
									Drag & Drop Math
								</h1>
								<p className='text-muted-foreground mb-4'>
									Enter a math problem below to generate a
									step-by-step solution that you can interact
									with.
								</p>
							</CardContent>
						</Card>

						<MathInput onSolutionGenerated={setMathSolution} />

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
						<MathSolutionSidebar
							mathSolution={mathSolution}
							edges={edges}
							verificationResult={verificationResult}
							grade={grade}
							solutionCorrect={solutionCorrect}
							onVerifyRequest={triggerVerification}
							onDragStart={handleDragStart}
							placedSteps={placedSteps}
							onResetSteps={resetSteps}
						/>
						<div className='flex-1 flex flex-col h-full overflow-hidden'>
							<div className='p-4 border-b flex items-center justify-between'>
								<h2 className='font-semibold flex items-center'>
									<Calculator className='h-5 w-5 mr-2 text-primary' />
									{mathSolution.title}
								</h2>
								<div className='flex items-center gap-4'>
									<MathGamificationBadge />
									<button
										onClick={() => setMathSolution(null)}
										className='text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center'
									>
										<ArrowRight className='h-4 w-4 mr-1' />
										Try another problem
									</button>
								</div>
							</div>
							<div className='flex-1 overflow-hidden'>
								<MathSolutionFlow
									ref={mathSolutionFlowRef}
									mathSolution={mathSolution}
									onEdgesUpdate={handleEdgesUpdate}
									onVerificationUpdate={
										handleVerificationUpdate
									}
									onPlacedStepsChange={
										handlePlacedStepsChange
									}
								/>
							</div>
						</div>
					</ReactFlowProvider>
				</div>
			)}
		</div>
	);
}
