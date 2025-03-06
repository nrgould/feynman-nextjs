'use client';

import { useState, useRef, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MathInput } from './MathInput';
import { MathSolutionSidebar } from './MathSolutionSidebar';
import { MathSolutionFlow, MathSolutionFlowHandle } from './MathSolutionFlow';
import { MathSolution, MathEdge, VerificationResult, MathStep } from './types';
import { useMathHistoryStore } from '@/store/math-history-store';
import { useMathProblemsStore } from '@/store/math-problems-store';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
	Calculator,
	ArrowRight,
	FileText,
	BookOpen,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { MathGamificationBadge } from './MathGamificationDisplay';
import { MathPdfUploader } from './MathPdfUploader';
import { MathProblemNavigation } from './MathProblemNavigation';
import { motion } from 'framer-motion';

const MathClient: React.FC = () => {
	const [mathSolution, setMathSolution] = useState<MathSolution | null>(null);
	const [edges, setEdges] = useState<MathEdge[]>([]);
	const [verificationResult, setVerificationResult] =
		useState<VerificationResult | null>(null);
	const [grade, setGrade] = useState<number | null>(null);
	const [solutionCorrect, setSolutionCorrect] = useState<boolean>(false);
	const [placedSteps, setPlacedSteps] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState<string>('single');

	// Reference to the MathSolutionFlow component
	const mathSolutionFlowRef = useRef<MathSolutionFlowHandle>(null);

	// Access the math history store
	const { updateSession } = useMathHistoryStore();

	// Access the math problems store
	const { getCurrentProblem, getTotalProblems, isLoading, clearProblems } =
		useMathProblemsStore();

	// Get the current problem from the store
	const currentProblem = getCurrentProblem();

	// Effect to set mathSolution when the current problem changes
	useEffect(() => {
		if (currentProblem) {
			setMathSolution(currentProblem);
			// Reset state for new problem
			setEdges([]);
			setVerificationResult(null);
			setGrade(null);
			setSolutionCorrect(false);
			setPlacedSteps([]);
		}
	}, [currentProblem]);

	// Handle tab change
	const handleTabChange = (value: string) => {
		// Reset state when switching tabs
		setMathSolution(null);
		setEdges([]);
		setVerificationResult(null);
		setGrade(null);
		setSolutionCorrect(false);
		setPlacedSteps([]);

		// If switching from PDF to single, clear the problems
		if (activeTab === 'pdf' && value === 'single') {
			clearProblems();
		}

		setActiveTab(value);
	};

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
		// Reset state
		setEdges([]);
		setVerificationResult(null);
		setGrade(null);
		setSolutionCorrect(false);
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

	// Handle single problem input
	const handleSingleProblem = (solution: MathSolution) => {
		setMathSolution(solution);
		setActiveTab('single');
	};

	// Handle going back to the selection screen
	const handleBackToSelection = () => {
		setMathSolution(null);
		resetSteps();
	};

	return (
		<div className='flex flex-col w-full h-[calc(100vh-56px)]'>
			{/* Show problem selection if no solution has been generated yet */}
			{!mathSolution ? (
				<div className='p-6 flex-1 overflow-auto bg-gradient-to-b from-indigo-50 via-white to-purple-50'>
					<div className='max-w-5xl mx-auto'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Card className='mb-8 overflow-hidden'>
								<div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white'>
									<h1 className='text-3xl font-bold mb-2 flex items-center'>
										<Calculator className='h-8 w-8 mr-3' />
										Drag & Drop Math
									</h1>
									<p className='text-indigo-100 max-w-3xl'>
										Solve step-by-step math problems by
										arranging and connecting the solution
										steps in the correct order. Practice
										your problem-solving skills and earn
										points as you progress!
									</p>
								</div>
							</Card>
						</motion.div>

						<Tabs
							defaultValue='single'
							className='mb-8'
							onValueChange={handleTabChange}
							value={activeTab}
						>
							<TabsList className='grid w-full max-w-md mx-auto grid-cols-2'>
								<TabsTrigger
									value='single'
									className='flex items-center gap-2'
								>
									<BookOpen className='h-4 w-4' />
									Single Problem
								</TabsTrigger>
								<TabsTrigger
									value='pdf'
									className='flex items-center gap-2'
								>
									<FileText className='h-4 w-4' />
									Multiple Problems
								</TabsTrigger>
							</TabsList>

							<TabsContent value='single' className='mt-6'>
								<MathInput
									onSolutionGenerated={handleSingleProblem}
								/>
							</TabsContent>

							<TabsContent value='pdf' className='mt-6'>
								<MathPdfUploader />
							</TabsContent>
						</Tabs>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
								<Card className='bg-white shadow-md overflow-hidden border-0'>
									<div className='h-2 bg-blue-500'></div>
									<CardContent className='pt-6'>
										<div className='flex items-center text-blue-600 mb-2'>
											<span className='flex h-8 w-8 rounded-full bg-blue-100 text-blue-600 items-center justify-center mr-2 font-bold'>
												1
											</span>
											<h3 className='font-medium'>
												Choose Your Math Problem
											</h3>
										</div>
										<p className='text-sm text-muted-foreground'>
											Enter a single problem or upload a
											PDF with multiple problems.
										</p>
									</CardContent>
								</Card>

								<Card className='bg-white shadow-md overflow-hidden border-0'>
									<div className='h-2 bg-purple-500'></div>
									<CardContent className='pt-6'>
										<div className='flex items-center text-purple-600 mb-2'>
											<span className='flex h-8 w-8 rounded-full bg-purple-100 text-purple-600 items-center justify-center mr-2 font-bold'>
												2
											</span>
											<h3 className='font-medium'>
												Arrange the Steps
											</h3>
										</div>
										<p className='text-sm text-muted-foreground'>
											Drag, drop, and connect the solution
											steps in the correct logical order.
										</p>
									</CardContent>
								</Card>

								<Card className='bg-white shadow-md overflow-hidden border-0'>
									<div className='h-2 bg-green-500'></div>
									<CardContent className='pt-6'>
										<div className='flex items-center text-green-600 mb-2'>
											<span className='flex h-8 w-8 rounded-full bg-green-100 text-green-600 items-center justify-center mr-2 font-bold'>
												3
											</span>
											<h3 className='font-medium'>
												Earn Points & Track Progress
											</h3>
										</div>
										<p className='text-sm text-muted-foreground'>
											Earn points and unlock achievements
											as you solve problems correctly.
										</p>
									</CardContent>
								</Card>
							</div>
						</motion.div>
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
							<div className='p-4 border-b flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50'>
								<div className='flex items-center'>
									<Button
										variant='ghost'
										size='sm'
										className='mr-2'
										onClick={handleBackToSelection}
									>
										<ChevronLeft className='h-4 w-4 mr-1' />
										Back
									</Button>
									<h2 className='font-semibold flex items-center'>
										<Calculator className='h-5 w-5 mr-2 text-primary' />
										{mathSolution?.title}
									</h2>
								</div>
								<div className='flex items-center gap-4'>
									<MathGamificationBadge />
								</div>
							</div>

							<div className='flex-1 overflow-hidden relative'>
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

							{/* Show problem navigation if there are multiple problems */}
							{getTotalProblems() > 1 && (
								<div className='border-t p-3 bg-white'>
									<MathProblemNavigation
										solutionCorrect={solutionCorrect}
										onReset={resetSteps}
									/>
								</div>
							)}
						</div>
					</ReactFlowProvider>
				</div>
			)}
		</div>
	);
};

export { MathClient };
