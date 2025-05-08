'use client';

import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import {
	RotateCwSquare,
	Send,
	List,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { extractMathProblem, generateMethods, generateSteps } from './actions';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import { Markdown } from '@/components/atoms/Markdown';

interface NextStepToolCall {
	toolName: 'askForNextStepTool';
	args: {
		feedback: string;
		newProblemState: string;
		options: string[];
	};
}
interface ExtractFeedbackToolCall {
	toolName: 'extractFeedback';
	args: {
		feedback: string;
		newProblemState: string;
		problemSolved: boolean;
	};
}
interface ProblemSolvedToolCall {
	toolName: 'problemSolvedTool';
	args: {
		message: string;
		finalAnswer: string;
	};
}

export default function Home() {
	const [initialProblem, setInitialProblem] = useState(
		'Differentiate f(x) = 3x^2 + 5x - 4.'
	);
	const [problemState, setProblemState] = useState(initialProblem);
	const [prevProblemState, setPrevProblemState] = useState('');
	const [problemTitle, setProblemTitle] = useState('Differentiate f(x):');

	const [feedback, setFeedback] = useState('');
	const [solved, setSolved] = useState(false);

	const [steps, setSteps] = useState<string[]>([]);
	const [showStepsDialog, setShowStepsDialog] = useState(false);

	const [analyzedPhoto, setAnalyzedPhoto] = useState(false);

	const [methods, setMethods] = useState<string[]>([]);
	const [selectedMethod, setSelectedMethod] = useState<string>(
		'The user wants to solve by applying the power rule.'
	);

	const [loading, setLoading] = useState(false);

	const { messages, append, addToolResult } = useChat({
		api: '/api/math-tutor',
		experimental_prepareRequestBody: (body) => {
			const response = {
				...body,
				initialProblem,
				problemState,
				prevProblemState,
				steps,
			};
			return response;
		},
		onToolCall: ({ toolCall }) => {
			console.log(toolCall);
			if (toolCall.toolName === 'askForNextStepTool') {
				const confirmationToolCall = toolCall as NextStepToolCall;
				// setPrevProblemState(problemState);
				// setProblemState(confirmationToolCall.args.newProblemState);
			}

			if (toolCall.toolName === 'extractFeedback') {
				const extractFeedbackToolCall =
					toolCall as ExtractFeedbackToolCall;
				setFeedback(extractFeedbackToolCall.args.feedback);
				setPrevProblemState(problemState);
				setProblemState(extractFeedbackToolCall.args.newProblemState);
			}

			if (toolCall.toolName === 'problemSolvedTool') {
				const problemSolvedToolCall = toolCall as ProblemSolvedToolCall;
				setPrevProblemState(problemState);
				setProblemState(problemSolvedToolCall.args.finalAnswer);
				setSolved(true);
			}
		},
	});

	async function handlePhotoAnalysis(publicUrl: string) {
		try {
			setLoading(true);
			const result = await extractMathProblem(publicUrl);
			setInitialProblem(result.problem);
			setProblemState(result.problem);
			setProblemTitle(result.title);

			//generate methods
			const methods = await generateMethods(result.problem);
			setMethods(methods);

			setLoading(false);
			setAnalyzedPhoto(true);
		} catch (error: any) {
			console.error('Error during photo analysis:', error);
			alert(
				`Error analyzing photo: ${error.message || 'An unknown error occurred.'}`
			);
		}
	}

	const uploadHookProps = useSupabaseUpload({
		bucketName: 'math-problem-photos',
		path: 'public',
		allowedMimeTypes: ['image/*'],
		maxFiles: 1,
		maxFileSize: 10 * 1024 * 1024,
		onUploadSuccess: (uploadedFile) => {
			if (uploadedFile && uploadedFile.publicUrl) {
				handlePhotoAnalysis(uploadedFile.publicUrl);
			} else {
				console.error(
					'Upload successful, but publicUrl not found in callback.'
				);
				alert(
					'Upload succeeded, but could not retrieve file URL for analysis.'
				);
			}
		},
	});

	function reset() {
		setProblemState('');
		setProblemTitle('');
		setInitialProblem('');
		setFeedback('');
		setSelectedMethod('');
		setSteps([]);
		setSolved(false);
		setShowStepsDialog(false);
		setAnalyzedPhoto(false);
	}

	async function generateMoreMethods() {
		const newMethods = await generateMethods(problemState, methods);
		setMethods(newMethods);
	}

	async function appendProblem(selectedMethod: string) {
		setLoading(true);
		setSelectedMethod(selectedMethod);
		// const steps = await generateSteps(problemState, selectedMethod);
		// setSteps(steps);
		setMethods([]);
		setLoading(false);
		append({
			role: 'user',
			content: `Use the ${selectedMethod} method to help the user solve the following problem: ${problemState}.`,
		});
	}

	function handleAddNewStep(step: string) {
		setSteps([...steps, step]);
	}

	if (!analyzedPhoto) {
		return (
			<div className='relative flex flex-col min-h-screen bg-background items-center justify-center p-4 gap-4'>
				<h1 className='text-2xl font-semibold mb-4'>
					Analyze a Math Problem from a Photo
				</h1>
				<div className='w-full max-w-md'>
					<Dropzone {...uploadHookProps}>
						<DropzoneEmptyState />
						<DropzoneContent />
					</Dropzone>
				</div>
				{loading && (
					<p className='text-sm text-muted-foreground mt-4'>
						Analyzing photo...
					</p>
				)}
				<p className='text-sm text-muted-foreground mt-4'>
					Drag & drop an image of a math problem, or click to select.
				</p>
			</div>
		);
	}
	if (analyzedPhoto) {
		return (
			<div className='relative flex flex-col h-full bg-background p-2 gap-2'>
				<Dialog
					open={showStepsDialog}
					onOpenChange={setShowStepsDialog}
				>
					<DialogTrigger asChild>
						<Button
							variant='outline'
							size='icon'
							className='absolute top-4 left-4 z-10'
							onClick={() => setShowStepsDialog(true)}
						>
							<List className='h-4 w-4' />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Steps Taken</DialogTitle>
						</DialogHeader>
						{steps && steps.length > 0 ? (
							<ul className='list-decimal list-inside space-y-2 p-4'>
								{steps.map((step, index) => (
									<li key={index}>
										<Markdown>{step}</Markdown>
									</li>
								))}
							</ul>
						) : (
							<p className='p-4 text-center text-muted-foreground'>
								No steps available yet. Start solving the
								problem!
							</p>
						)}
					</DialogContent>
				</Dialog>

				<div className='flex-1 min-h-[40vh] flex flex-col justify-between items-center border rounded-lg p-2 pt-4'>
					<h2 className='text-lg text-muted-foreground mb-4 max-w-3/4'>
						<Markdown>{problemTitle}</Markdown>
					</h2>
					<div>
						<AnimatePresence>
							{prevProblemState && (
								<motion.div
									key={'prev-' + prevProblemState}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 30,
										duration: 0.5,
									}}
									className={`text-md text-muted-foreground text-center pt-4`}
								>
									<Markdown>{prevProblemState}</Markdown>
								</motion.div>
							)}
							<motion.div
								key={'curr-' + problemState}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{
									opacity: 0,
									y: -40,
									scale: 0.8,
									position: 'absolute',
								}}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 30,
									duration: 0.5,
								}}
								className={`text-xl font-semibold text-center pb-4 ${
									solved ? 'text-green-500' : ''
								}`}
							>
								<Markdown>{problemState}</Markdown>
							</motion.div>
						</AnimatePresence>
					</div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.5,
						}}
						className='text-sm text-center p-4 max-w-sm min-h-[6rem] max-h-[6rem] tracking-wide'
					>
						<Markdown>{feedback}</Markdown>
					</motion.div>
				</div>

				<div className='flex-1 max-h-[50vh] flex flex-col justify-between border rounded-lg p-4'>
					<div className='flex-1 overflow-y-auto'>
						{methods.length > 0 && (
							<div className='flex flex-col gap-4'>
								<h2 className='text-xl font-semibold mb-4 text-center'>
									Choose a method to solve the problem
								</h2>
								<div className='grid grid-cols-2 gap-4'>
									{methods.map((method, index) => (
										<Button
											size='lg'
											key={index}
											variant='outline'
											className='py-12 text-wrap px-4'
											onClick={() =>
												appendProblem(method)
											}
										>
											<Markdown>{method}</Markdown>
										</Button>
									))}
								</div>
								<Button
									variant='ghost'
									onClick={generateMoreMethods}
								>
									Preferred method not here
								</Button>
							</div>
						)}
						{messages?.map((message) => (
							<div key={message.id}>
								{message.parts.map((part, partIndex) => {
									if (part.type === 'tool-invocation') {
										const {
											toolCallId,
											toolName,
											args,
											state,
										} = part.toolInvocation;
										if (toolName === 'askForNextStepTool') {
											if (state === 'call') {
												return (
													<div
														className='flex-1 flex flex-col p-4 items-center justify-center'
														key={`${toolCallId}-${partIndex}-ask-call`}
													>
														<h2 className='text-xl font-semibold mb-4 text-center'>
															{args.title}
														</h2>
														<div className='grid grid-cols-2 gap-4'>
															{args.options.map(
																(
																	option: string,
																	optionIndex: number
																) => (
																	<Button
																		key={`${option}-${optionIndex}`}
																		onClick={() => {
																			handleAddNewStep(
																				option
																			);
																			addToolResult(
																				{
																					toolCallId:
																						toolCallId,
																					result: option,
																				}
																			);
																		}}
																		variant='outline'
																		className='py-12 text-wrap px-4'
																	>
																		<Markdown>
																			{
																				option
																			}
																		</Markdown>
																	</Button>
																)
															)}
														</div>
													</div>
												);
											}
										} else if (
											toolName === 'problemSolvedTool'
										) {
											if (state === 'result') {
												return (
													<div
														key={`${toolCallId}-${partIndex}-solved-call`}
														className='flex flex-col p-4 gap-4 px-4'
													>
														<p className='text-center'>
															{args.message}
														</p>
														<div className='flex justify-center gap-4'>
															<Button>
																<Send /> Share
																Solution
															</Button>
															<Button
																variant='outline'
																onClick={reset}
															>
																<RotateCwSquare />{' '}
																Try Another
																Problem
															</Button>
														</div>
													</div>
												);
											}
										}
									}
									return null;
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}
