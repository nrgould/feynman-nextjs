'use client';

import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { Loader2, RotateCwSquare, Send, List, User2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	extractMathProblem,
	generateMethods,
	saveMathProblem,
	updateProblemLimitAfterAnalysis,
} from './actions';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { Markdown } from '@/components/atoms/Markdown';
import { TextInputProblem } from '@/components/problem-input/TextInputProblem';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import MethodList from '@/components/problem-input/MethodList';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import MenuDrawer from '@/components/molecules/MenuDrawer';

interface ExtractFeedbackToolCall {
	toolName: 'extractFeedback';
	args: {
		feedback: string;
		feedbackType: 'positive' | 'negative' | 'neutral';
		currentProblemState: string;
		problemSolved: boolean;
	};
}

interface Option {
	label: string;
	input?: string;
}

export default function Home() {
	const [initialProblem, setInitialProblem] = useState('');
	const [problemState, setProblemState] = useState(initialProblem);
	const [prevProblemState, setPrevProblemState] = useState('');
	const [problemTitle, setProblemTitle] = useState('');
	const [problemLimit, setProblemLimit] = useState(1);

	const [inputMode, setInputMode] = useState<'photo' | 'text'>('photo');
	const [feedback, setFeedback] = useState('');
	const [solved, setSolved] = useState(false);
	const [feedbackType, setFeedbackType] = useState<
		'positive' | 'negative' | 'neutral'
	>('neutral');

	const [steps, setSteps] = useState<string[]>([]);
	const [showStepsDialog, setShowStepsDialog] = useState(false);

	const [analyzedPhoto, setAnalyzedPhoto] = useState(false);

	const [methods, setMethods] = useState<string[]>([]);
	const [selectedMethod, setSelectedMethod] = useState<string>('');

	const [loading, setLoading] = useState(false);

	const { toast } = useToast();

	const { user, isLoaded } = useUser();

	useEffect(() => {
		console.log(user, isLoaded);
		if (user) {
			console.log(user);
			const problemLimit = user.publicMetadata.problem_limit;
			setProblemLimit(problemLimit as number);
		}
	}, [user, isLoaded]);

	const { messages, append, addToolResult, error } = useChat({
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
			console.log(toolCall.toolName, toolCall.args);

			if (toolCall.toolName === 'extractFeedback') {
				const extractFeedbackToolCall =
					toolCall as ExtractFeedbackToolCall;
				setFeedback(extractFeedbackToolCall.args.feedback);
				setSolved(extractFeedbackToolCall.args.problemSolved);

				if (solved && user) {
					//save the problem to supabase
					saveMathProblem({
						initialProblem: initialProblem,
						title: problemTitle,
						steps: steps,
						solved: true,
						selectedMethod: selectedMethod,
					});
				}

				setPrevProblemState(problemState);
				const newProblemState =
					extractFeedbackToolCall.args.currentProblemState;

				setProblemState(newProblemState);
				setFeedbackType(extractFeedbackToolCall.args.feedbackType);
				setSteps((prevSteps) => [...prevSteps, newProblemState]);
			}
		},
	});

	useEffect(() => {
		if (error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with your request.',
				duration: 10000,
				action: (
					<ToastAction
						altText='Try again'
						onClick={() =>
							append({
								role: 'user',
								content: 'Try the last step again.',
							})
						}
					>
						Try again
					</ToastAction>
				),
			});
		}
	}, [error]);

	async function handlePhotoAnalysis(publicUrl: string) {
		try {
			setLoading(true);
			const result = await extractMathProblem(publicUrl);
			setInitialProblem(result.problem);
			setProblemState(result.problem);
			setProblemTitle(result.title);
			setSteps([result.problem]);

			//generate methods
			const methods = await generateMethods(result.problem);
			setMethods(methods);

			setLoading(false);
			setAnalyzedPhoto(true);

			updateProblemLimitAfterAnalysis();
		} catch (error: any) {
			console.error('Error during photo analysis:', error);
			toast({
				variant: 'destructive',
				title: 'Error analyzing photo',
				description: error.message || 'An unknown error occurred.',
			});
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

	function handleTextInputProblemSubmit(
		problem: string,
		generatedMethods: string[]
	) {
		const newTitle =
			problem.length > 30
				? `Problem: ${problem.substring(0, 27)}...`
				: `Problem: ${problem}`;
		setInitialProblem(problem);
		setProblemState(problem);
		setProblemTitle(newTitle);
		setSteps([problem]);
		setMethods(generatedMethods);

		setAnalyzedPhoto(true);
		updateProblemLimitAfterAnalysis();
	}

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
		setInputMode('photo');
	}

	async function generateMoreMethods() {
		const newMethods = await generateMethods(problemState, methods);
		setMethods(newMethods);
	}

	async function appendProblem(selectedMethod: string) {
		setLoading(true);
		setSelectedMethod(selectedMethod);

		if (user) {
			//save the problem to supabase
			await saveMathProblem({
				initialProblem: initialProblem,
				title: problemTitle,
				steps: steps,
				solved: false,
				selectedMethod: selectedMethod,
			});
		}

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
				<div className='absolute top-5 left-0 right-0 '>
					<MenuDrawer />
				</div>
				<h1 className='text-4xl font-semibold text-center'>
					Interactive Math Tutor
				</h1>
				<h2 className='text-md text-muted-foreground mb-4 text-center'>
					Upload a photo of a math problem to get started.
				</h2>
				<div className='flex items-center space-x-2 mb-4'>
					<Label htmlFor='input-mode-switch'>Photo Mode</Label>
					<Switch
						id='input-mode-switch'
						checked={inputMode === 'text'}
						onCheckedChange={(checked) =>
							setInputMode(checked ? 'text' : 'photo')
						}
					/>
					<Label htmlFor='input-mode-switch'>Text Mode</Label>
				</div>

				{inputMode === 'photo' ? (
					<div className='w-full max-w-md'>
						<Dropzone {...uploadHookProps}>
							<DropzoneEmptyState />
							<DropzoneContent />
						</Dropzone>
					</div>
				) : (
					<div className='w-full max-w-md'>
						<TextInputProblem
							onProblemSubmit={handleTextInputProblemSubmit}
							setLoading={setLoading}
						/>
					</div>
				)}

				{loading && (
					<div className='text-sm text-muted-foreground mt-4 flex items-center gap-2'>
						<Loader2 className='animate-spin' /> Analyzing...
					</div>
				)}
			</div>
		);
	}
	if (analyzedPhoto) {
		return (
			<div className='relative flex flex-col h-full bg-background p-2 gap-2 pt-20'>
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
					<DialogContent className='sm:max-w-7/8'>
						<DialogHeader>
							<DialogTitle>Problem History</DialogTitle>
						</DialogHeader>
						{steps && steps.length > 0 ? (
							<ul className='list-decimal list-inside space-y-3 p-4 max-h-[70vh] overflow-y-auto'>
								{steps.map(
									(currentProblemStateString, index) => (
										<li key={index} className='mb-1'>
											<p className='font-semibold text-sm'>
												{index === 0
													? 'Initial Problem:'
													: `After Step ${index}:`}
											</p>
											<Markdown>
												{currentProblemStateString}
											</Markdown>
										</li>
									)
								)}
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
					<h2 className='text-lg text-muted-foreground mb-4 max-w-[350px] text-center'>
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
									className={`text-md text-muted-foreground text-center`}
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
								className={`text-xl md:text-3xl font-semibold text-center ${
									solved ? 'text-emerald-500' : ''
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
							stiffness: 100,
							damping: 10,
							duration: 0.3,
						}}
						className={`text-sm md:text-md text-center p-4 max-w-lg md:max-w-[40rem] max-h-[6rem] tracking-wide ${
							feedbackType === 'positive'
								? 'text-emerald-500'
								: feedbackType === 'negative'
									? 'text-amber-500'
									: 'text-muted-foreground'
						}`}
					>
						<Markdown>{feedback}</Markdown>
					</motion.div>
				</div>

				<div className='flex-1 max-h-[50vh] flex flex-col justify-between border rounded-lg p-2 mb-8'>
					{loading && (
						<p className='text-sm text-muted-foreground mt-4'>
							Processing...
						</p>
					)}
					<div className='flex-1 overflow-y-auto'>
						{methods.length > 0 && (
							<MethodList
								methods={methods}
								generateMoreMethods={generateMoreMethods}
								appendProblem={appendProblem}
							/>
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
												const randomizedOptions =
													args.options.sort(
														() =>
															Math.random() - 0.5
													);
												return (
													<div
														className='flex-1 flex flex-col p-4 items-center justify-center'
														key={`${toolCallId}-${partIndex}-ask-call`}
													>
														<h2 className='text-xl font-semibold mb-4 text-center'>
															<Markdown>
																{args.title}
															</Markdown>
														</h2>
														<div className='grid grid-cols-2 gap-4 w-full md:w-1/2'>
															{randomizedOptions.map(
																(
																	option: Option,
																	optionIndex: number
																) => {
																	if (
																		option.input
																	) {
																		return (
																			<div
																				key={`option-input-${optionIndex}`}
																				className='flex flex-col gap-2'
																			>
																				<Dialog>
																					<DialogTrigger
																						asChild
																					>
																						<Button
																							variant='outline'
																							className='py-12 text-wrap px-4'
																						>
																							<Markdown>
																								{
																									option.label
																								}
																							</Markdown>
																						</Button>
																					</DialogTrigger>
																					<DialogContent>
																						<DialogHeader>
																							<DialogTitle>
																								<Markdown>
																									{
																										option.label
																									}
																								</Markdown>
																							</DialogTitle>
																						</DialogHeader>
																						<form
																							className='p-4'
																							onSubmit={(
																								e
																							) => {
																								e.preventDefault();
																								const formData =
																									new FormData(
																										e.currentTarget
																									);
																								const inputValue =
																									formData.get(
																										'calculation'
																									) as string;
																								const result = `${option.label} (User inputted: ${inputValue})`;
																								handleAddNewStep(
																									result
																								);
																								addToolResult(
																									{
																										toolCallId,
																										result,
																									}
																								);
																							}}
																						>
																							<Input
																								type='text'
																								name='calculation'
																								placeholder={
																									option.input
																								}
																							/>
																							<Button
																								type='submit'
																								className='mt-4'
																							>
																								Submit
																							</Button>
																						</form>
																					</DialogContent>
																				</Dialog>
																			</div>
																		);
																	} else {
																		return (
																			<Button
																				key={`option-${optionIndex}`}
																				onClick={() => {
																					handleAddNewStep(
																						option.label
																					);
																					addToolResult(
																						{
																							toolCallId,
																							result: option.label,
																						}
																					);
																				}}
																				variant='outline'
																				className='py-16 text-wrap px-2'
																			>
																				<Markdown>
																					{
																						option.label
																					}
																				</Markdown>
																			</Button>
																		);
																	}
																}
															)}
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
						{solved && (
							<div className='flex flex-col p-4 justify-between items-center h-full gap-4 px-4'>
								<h2 className='text-center text-lg font-semibold'>
									Problem solved!
								</h2>
								<div className='w-full flex justify-center items-center gap-4'>
									<Button>
										<Send /> Share Solution
									</Button>
									<SignedIn>
										<Button
											variant='outline'
											onClick={reset}
										>
											<RotateCwSquare /> Do Another
											Problem
										</Button>
									</SignedIn>
									<SignedOut>
										<Button variant='outline'>
											<User2Icon /> Sign up to continue
										</Button>
									</SignedOut>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
