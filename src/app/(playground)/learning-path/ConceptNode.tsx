'use client';

import { Handle, Position } from '@xyflow/react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, BookOpen, Play, ArrowRight, Loader2 } from 'lucide-react';
import { LearningPathNode } from '@/lib/learning-path-schemas';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { generateUUID } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkConceptActive, createChatFromLearningPathNode } from './actions';

interface ConceptNodeProps {
	data: {
		node: LearningPathNode;
		onProgressChange?: (id: string, progress: number) => void;
		isDisabled?: boolean;
	};
	selected: boolean;
}

export function ConceptNode({ data, selected }: ConceptNodeProps) {
	const { node, onProgressChange, isDisabled } = data;
	const [isLoading, setIsLoading] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [chatId, setChatId] = useState<string | null>(null);
	const [isChecking, setIsChecking] = useState(true);
	const router = useRouter();

	// Check if the concept is active on component mount
	useEffect(() => {
		const checkActive = async () => {
			setIsChecking(true);
			try {
				const result = await checkConceptActive(node.id);
				if (result.success) {
					setIsActive(result.isActive);
					setChatId(result.chatId);
				}
			} catch (error) {
				console.error('Error checking if concept is active:', error);
			} finally {
				setIsChecking(false);
			}
		};

		checkActive();
	}, [node.id]);

	// Function to get color based on difficulty
	const getDifficultyColor = (difficulty: number) => {
		if (difficulty <= 3)
			return 'bg-emerald-100 text-emerald-800 border-emerald-200';
		if (difficulty <= 6)
			return 'bg-amber-100 text-amber-800 border-amber-200';
		return 'bg-rose-100 text-rose-800 border-rose-200';
	};

	// Function to get grade color and letter
	const getGradeInfo = (grade: number | undefined) => {
		if (grade === undefined)
			return { color: 'text-gray-400', letter: 'Not Started' };
		if (grade >= 90) return { color: 'text-emerald-500', letter: 'A' };
		if (grade >= 80) return { color: 'text-emerald-400', letter: 'B' };
		if (grade >= 70) return { color: 'text-yellow-500', letter: 'C' };
		if (grade >= 60) return { color: 'text-red-400', letter: 'D' };
		return { color: 'text-red-500', letter: 'F' };
	};

	const handleStartConcept = async () => {
		try {
			setIsLoading(true);

			// Generate a unique ID for the chat
			const chatId = generateUUID();

			// Show a toast to indicate the process has started
			toast({
				title: 'Starting Concept',
				description: `Creating a chat for ${node.concept}...`,
			});

			// Call the server action to create a chat from this node
			const result = await createChatFromLearningPathNode(
				{
					id: node.id,
					concept: node.concept,
					description: node.description,
				},
				chatId,
				false // Disable server-side redirect
			);

			if (!result.success) {
				throw new Error(result.error);
			}

			// Navigate to the chat page using the returned chat ID
			router.push(`/chat/${result.chatId || chatId}`);
		} catch (error) {
			console.error('Error starting concept:', error);
			toast({
				title: 'Error',
				description:
					'Failed to start learning this concept. Please try again.',
				variant: 'destructive',
			});
			setIsLoading(false);
		}
	};

	const handleContinueConcept = async () => {
		if (!chatId) return;

		try {
			setIsLoading(true);

			// Show a toast notification
			toast({
				title: 'Continuing Learning',
				description: `Resuming your chat for ${node.concept}...`,
			});

			// Navigate to the chat page
			await router.push(`/chat/${chatId}`);
		} catch (error) {
			console.error('Error continuing concept:', error);
			toast({
				title: 'Error',
				description:
					'Failed to continue learning this concept. Please try again.',
				variant: 'destructive',
			});
			setIsLoading(false);
		}
	};

	const difficultyClass = getDifficultyColor(node.difficulty);
	const gradeInfo = getGradeInfo(node.grade);
	const canStart = !isDisabled && node.grade === undefined;

	return (
		<div
			className={cn(
				'p-4 rounded-lg shadow-md bg-white border-2 w-[250px] transition-opacity duration-200',
				selected ? 'border-primary' : 'border-gray-200',
				isActive && !isDisabled ? 'border-l-4 border-l-blue-500' : '',
				isDisabled && 'opacity-50 cursor-not-allowed'
			)}
		>
			{/* Source handle */}
			<Handle
				type='source'
				position={Position.Right}
				className={cn(
					'w-3 h-3 border-2 border-white',
					isDisabled ? 'bg-gray-400' : 'bg-primary'
				)}
			/>

			{/* Target handle */}
			<Handle
				type='target'
				position={Position.Left}
				className={cn(
					'w-3 h-3 border-2 border-white',
					isDisabled ? 'bg-gray-400' : 'bg-primary'
				)}
			/>

			<div className='space-y-3'>
				{/* Concept title with active indicator */}
				<div className='flex items-center justify-between'>
					<h3 className='font-semibold text-gray-800'>
						{node.concept}
					</h3>
					{isActive && !isDisabled && !isChecking && (
						<Badge
							variant='outline'
							className='bg-blue-50 text-blue-600 border-blue-200 text-xs px-2'
						>
							Active
						</Badge>
					)}
				</div>

				{/* Description */}
				<p className='text-sm text-gray-600 line-clamp-2'>
					{node.description}
				</p>

				{/* Metadata */}
				<div className='flex flex-wrap gap-2 text-xs'>
					<Badge variant='outline' className={difficultyClass}>
						<BarChart className='w-3 h-3 mr-1' />
						Difficulty: {node.difficulty}/10
					</Badge>

					{/* <Badge
						variant='outline'
						className='bg-violet-50 text-violet-700 border-violet-200'
					>
						<BookOpen className='w-3 h-3 mr-1' />
						Grade:{' '}
						<span className={`ml-1 font-bold ${gradeInfo.color}`}>
							{gradeInfo.letter}
						</span>
					</Badge> */}
				</div>

				{/* Progress section */}
				<div className='space-y-1'>
					<div className='flex justify-between text-xs text-gray-600'>
						<span>Progress</span>
						<span>{node.progress}%</span>
					</div>
					<Progress value={node.progress} className='h-2' />
				</div>

				{/* Button section - show different buttons based on state */}
				{!isDisabled && !isChecking && (
					<>
						{isActive && chatId ? (
							// Continue button for active concepts
							<Button
								className='w-full gap-2 mt-2'
								onClick={handleContinueConcept}
								size='sm'
								variant='outline'
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className='h-4 w-4 animate-spin' />
										Loading...
									</>
								) : (
									<>
										<ArrowRight className='w-4 h-4' />
										Continue Learning
									</>
								)}
							</Button>
						) : (
							// Start button for inactive concepts
							<Button
								className='w-full gap-2 mt-2'
								onClick={handleStartConcept}
								size='sm'
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className='h-4 w-4 animate-spin' />
										Creating...
									</>
								) : (
									<>
										<Play className='w-4 h-4' />
										Start Learning
									</>
								)}
							</Button>
						)}
					</>
				)}

				{/* Loading state while checking if concept is active */}
				{!isDisabled && isChecking && (
					<div className='w-full flex justify-center mt-2'>
						<span className='text-xs text-gray-500 animate-pulse'>
							Checking status...
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
