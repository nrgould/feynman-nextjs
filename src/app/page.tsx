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
import { extractMathProblem } from './actions';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';

interface ConfirmationToolCall {
	toolName: 'askForConfirmationTool';
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
	};
}

interface GenerateStepsToolCall {
	toolName: 'generateSteps';
	args: {
		steps: string[];
	};
}

interface AskForMethodToolCall {
	toolName: 'askForMethodTool';
	args: {
		title: string;
		options: string[];
	};
}

export default function Home() {
	const [initialProblem, setInitialProblem] = useState(
		'Solve for x: 2x + 5 = 15'
	);
	const [problemState, setProblemState] = useState(initialProblem);
	const [prevProblemState, setPrevProblemState] = useState('');
	const [problemTitle, setProblemTitle] = useState('Solve for x:');
	const [feedback, setFeedback] = useState('');
	const [steps, setSteps] = useState<string[]>([]);
	const [solved, setSolved] = useState(false);
	const [showStepsDialog, setShowStepsDialog] = useState(false);
	const [analyzedPhoto, setAnalyzedPhoto] = useState(false);

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
			console.log(toolCall.toolName);
			if (toolCall.toolName === 'askForConfirmationTool') {
				const confirmationToolCall = toolCall as ConfirmationToolCall;
				setPrevProblemState(problemState);
				setProblemState(confirmationToolCall.args.newProblemState);
			}

			if (toolCall.toolName === 'problemSolvedTool') {
				setSolved(true);
			}

			if (toolCall.toolName === 'askForMethodTool') {
				console.log(toolCall);
			}

			if (toolCall.toolName === 'extractFeedback') {
				const extractFeedbackToolCall =
					toolCall as ExtractFeedbackToolCall;
				setFeedback(extractFeedbackToolCall.args.feedback);
			}

			if (toolCall.toolName === 'generateSteps') {
				const generateStepsToolCall = toolCall as GenerateStepsToolCall;
				setSteps(generateStepsToolCall.args.steps);
			}
		},
	});

	async function handlePhotoAnalysis(publicUrl: string) {
		try {
			const result = await extractMathProblem(publicUrl);
			console.log(result);
			const extractedProblemText: string =
				(result as any)?.toString() ||
				'Error: Could not extract text from photo';

			setInitialProblem(extractedProblemText);
			setProblemState(extractedProblemText);
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
		setProblemState('Solve for x: 2x + 5 = 15');
		setProblemTitle('Solve for x:');
		setInitialProblem('Solve for x: 2x + 5 = 15');
		setFeedback('');
		setSteps([]);
		setSolved(false);
		setShowStepsDialog(false);
		setAnalyzedPhoto(false);
	}

	function appendProblem() {
		append({
			role: 'user',
			content: problemState,
		});
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
				<p className='text-sm text-muted-foreground mt-4'>
					Drag & drop an image of a math problem, or click to select.
				</p>
			</div>
		);
	}
	if (analyzedPhoto) {
		return (
			<div className='relative flex flex-col min-h-screen bg-background p-4 gap-4'>
				<Dialog
					open={showStepsDialog}
					onOpenChange={setShowStepsDialog}
				>
					<DialogTrigger asChild>
						<Button
							variant='outline'
							size='icon'
							className='absolute top-8 left-8 z-10'
							onClick={() => setShowStepsDialog(true)}
						>
							<List className='h-4 w-4' />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Problem Steps</DialogTitle>
						</DialogHeader>
						{steps && steps.length > 0 ? (
							<ul className='list-decimal list-inside space-y-2 p-4'>
								{steps.map((step, index) => (
									<li key={index}>{step}</li>
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

				<div className='flex-1 min-h-[50vh] flex flex-col justify-center items-center border rounded-lg p-4'>
					<h2 className='text-xl font-semibold mb-4'>
						{problemTitle}
					</h2>
					<AnimatePresence>
						{prevProblemState && (
							<motion.p
								key={'prev-' + prevProblemState}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 30,
								}}
								className={`text-md text-muted-foreground text-center pt-4`}
							>
								{prevProblemState}
							</motion.p>
						)}
						<motion.p
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
							}}
							className={`text-3xl font-semibold text-center pb-4 ${
								solved ? 'text-green-500' : ''
							}`}
						>
							{problemState}
						</motion.p>
					</AnimatePresence>
					{messages.length === 0 && (
						<Button variant='outline' onClick={appendProblem}>
							Solve for x
						</Button>
					)}
					<p className='text-sm text-center p-4'>{feedback}</p>
				</div>

				<div className='flex-1 max-h-[50vh] flex flex-col justify-between border rounded-lg p-4'>
					<div className='flex-1 overflow-y-auto'>
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
										if (
											toolName ===
											'askForConfirmationTool'
										) {
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
																			addToolResult(
																				{
																					toolCallId:
																						toolCallId,
																					result: option,
																				}
																			);
																		}}
																		variant='outline'
																		className='w-[8rem] h-[8rem] text-center whitespace-normal bg-background hover:bg-background/80 dark:bg-zinc-800 rounded-xl'
																	>
																		{option}
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
											if (state === 'call') {
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
										} else if (
											toolName === 'askForMethodTool'
										) {
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
																			addToolResult(
																				{
																					toolCallId:
																						toolCallId,
																					result: option,
																				}
																			);
																		}}
																		variant='outline'
																		className='w-[8rem] h-[8rem] text-center whitespace-normal bg-background hover:bg-background/80 dark:bg-zinc-800 rounded-xl'
																	>
																		{option}
																	</Button>
																)
															)}
														</div>
													</div>
												);
											}
										}
									}
									return null;
								})}
								<br />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}
