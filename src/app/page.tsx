'use client';

import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { Loader2, RotateCwSquare, Send, List, User2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';

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
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import MenuDrawer from '@/components/molecules/MenuDrawer';
import { Progress } from '@/components/ui/progress';
import useProblemLimitStore from '@/store/problem-limit';
import ProblemHistory from '@/components/organisms/ProblemHistory';
import Link from 'next/link';
import ProblemSolvedDisplay from '@/components/organisms/ProblemSolvedDisplay';
import InteractiveStepOptions from '@/components/molecules/InteractiveStepOptions';
import { Option } from '@/components/molecules/InteractiveStepOptions';

interface ExtractFeedbackToolCall {
	toolName: 'extractFeedback';
	args: {
		feedback: string;
		feedbackType: 'positive' | 'negative' | 'neutral';
		currentProblemState: string;
		problemSolved: boolean;
	};
}

export default function Home() {
	const [initialProblem, setInitialProblem] = useState('');
	const [problemState, setProblemState] = useState(initialProblem);
	const [prevProblemState, setPrevProblemState] = useState('');
	const [problemTitle, setProblemTitle] = useState('');
	const [lastSavedProblemId, setLastSavedProblemId] = useState<string | null>(
		null
	);
	const {
		problemLimit: guestProblemLimit,
		decrementProblemLimit: decrementGuestProblemLimit,
	} = useProblemLimitStore();

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

	const remainingProblems =
		user &&
		user.publicMetadata.problem_limit &&
		user.publicMetadata.completed_problems
			? (user.publicMetadata.problem_limit as number) -
				(user.publicMetadata.completed_problems as number)
			: guestProblemLimit;

	useEffect(() => {
		console.log(user, isLoaded);
		if (user && isLoaded) {
			console.log(user);
			console.log(remainingProblems);
		}
	}, [user, isLoaded, remainingProblems]);

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
				const currentFeedback = extractFeedbackToolCall.args.feedback;
				const currentProblemSolved =
					extractFeedbackToolCall.args.problemSolved;
				const currentFeedbackType =
					extractFeedbackToolCall.args.feedbackType;

				setFeedback(currentFeedback);
				setSolved(currentProblemSolved);

				if (currentProblemSolved && user) {
					//save the problem to supabase
					saveMathProblem({
						initialProblem: initialProblem,
						title: problemTitle,
						steps: steps,
						solved: true,
						selectedMethod: selectedMethod,
					}).then((result) => {
						if (result && result.data && result.data.length > 0) {
							setLastSavedProblemId(result.data[0].id);
						}
					});
				}

				setPrevProblemState(problemState);
				const newProblemState =
					extractFeedbackToolCall.args.currentProblemState;

				setProblemState(newProblemState);
				setFeedbackType(currentFeedbackType);
				setSteps((prevSteps) => [...prevSteps, newProblemState]);

				// Show feedback as a toast
				let toastTitle = 'Feedback';
				if (currentFeedbackType === 'positive') {
					toastTitle = 'Great job!';
				} else if (currentFeedbackType === 'negative') {
					toastTitle = 'Almost there!';
				}
				toast({
					title: toastTitle,
					description: <Markdown>{currentFeedback}</Markdown>,
					duration: 8000, // Adjust duration as needed
				});
			}
		},
	});

	useEffect(() => {
		if (error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description:
					typeof error.message === 'string' ? (
						<Markdown>{error.message}</Markdown>
					) : (
						'There was a problem with your request.'
					),
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

			updateProblemLimitAfterAnalysis(); //update on clerk metadata
			if (!user) {
				decrementGuestProblemLimit();
			}
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
		updateProblemLimitAfterAnalysis(); //update on clerk metadata
		if (!user) {
			decrementGuestProblemLimit();
		}
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
			const savedProblemResult = await saveMathProblem({
				initialProblem: initialProblem,
				title: problemTitle,
				steps: steps,
				solved: false,
				selectedMethod: selectedMethod,
			});
			console.log(savedProblemResult);
			if (
				savedProblemResult &&
				savedProblemResult.data &&
				savedProblemResult.data.length > 0
			) {
				setLastSavedProblemId(savedProblemResult.data[0].id);
			}
		} else {
			// For guest users, they have already passed the analysis stage.
			// The limit was for analysis. Now they are working on the analyzed problem.
			// No specific limit check needed here for *this* action on an active problem.
			// The `decrementGuestProblemLimit` has already happened during analysis.
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

	if (!isLoaded) {
		return (
			<div className='flex flex-col min-h-screen bg-background items-center justify-center'>
				<Loader2 className='animate-spin h-12 w-12' />
				<p className='text-muted-foreground mt-2'>Loading...</p>
			</div>
		);
	}

	if (!analyzedPhoto) {
		// Check for signed-out user and if limit is reached before showing input options
		if (!user && guestProblemLimit <= 0) {
			return (
				<div className='relative flex flex-col min-h-screen bg-background items-center justify-center p-4 gap-4'>
					<div className='absolute top-5 left-0 right-0 '>
						<MenuDrawer />
					</div>
					<h1 className='text-4xl font-semibold text-center leading-tight'>
						You have reached your problem limit!
					</h1>

					<p className='text-sm text-center text-muted-foreground'>
						Please sign in or create an account to continue.
					</p>
					<SignedOut>
						<SignInButton mode='modal'>
							<Button>
								<User2Icon /> Sign up to continue
							</Button>
						</SignInButton>
					</SignedOut>
				</div>
			);
		}
		return (
			<div className='relative flex flex-col min-h-screen bg-background items-center justify-center p-4 gap-4'>
				<div className='absolute top-5 left-0 right-0 '>
					<MenuDrawer />
				</div>
				<h1 className='text-2xl md:text-4xl font-semibold text-center'>
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
			<div className='relative flex flex-col h-screen bg-background p-2 gap-2 pt-14 md:pt-20'>
				<ProblemHistory
					showStepsDialog={showStepsDialog}
					setShowStepsDialog={setShowStepsDialog}
					steps={steps}
				/>

				<div className='flex-1 flex flex-col items-center border rounded-lg p-2 gap-2 overflow-hidden'>
					<h2 className='text-md sm:text-lg text-muted-foreground max-w-xs sm:max-w-sm md:max-w-md text-center px-2'>
						<Markdown>{problemTitle}</Markdown>
					</h2>
					<div className='flex flex-col items-center text-center w-full px-2'>
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
									className={
										'text-sm sm:text-base text-muted-foreground'
									}
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
								className={`text-lg sm:text-lg md:text-2xl font-semibold ${
									solved ? 'text-emerald-500' : ''
								}`}
							>
								<Markdown>{problemState}</Markdown>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				<div className='flex-1 flex flex-col justify-between border rounded-lg p-2'>
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
												return (
													<InteractiveStepOptions
														key={`${toolCallId}-${partIndex}-ask-call`}
														toolCallId={toolCallId}
														title={args.title}
														options={
															args.options as Option[]
														}
														handleAddNewStep={
															handleAddNewStep
														}
														addToolResult={
															addToolResult
														}
													/>
												);
											}
										}
									}
									return null;
								})}
							</div>
						))}
						{solved && (
							<ProblemSolvedDisplay
								remainingProblems={remainingProblems}
								lastSavedProblemId={lastSavedProblemId}
								reset={reset}
								user={user}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}
