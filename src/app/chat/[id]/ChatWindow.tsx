'use client';

import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { Conversation, Message } from '@/lib/types';
import { useTitleStore, useProgressStore } from '@/store/store';
import { Attachment } from 'ai';
import { useChat } from 'ai/react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import Timer from '@/components/atoms/Timer';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { LearningPathSidebar } from '@/components/molecules/LearningPathSidebar';
import { MobileLearningPathSidebar } from '@/components/molecules/MobileLearningPathSidebar';
import { updateUserSessionTime, updateConceptProgress } from './actions';
import { toast } from '@/hooks/use-toast';

const TIMER_DURATION = 10;
const PROGRESS_INCREMENT = 5; // Increment progress by 5% when positive feedback is detected

function ChatWindow({
	initialMessages,
	userId,
	chat,
}: {
	chat: Conversation;
	initialMessages: Message[];
	userId: string;
}) {
	const [attachments, setAttachments] = useState<Array<Attachment>>([]);
	const { mutate } = useSWRConfig();
	const { setTitle } = useTitleStore();
	const { conceptProgress, setConceptProgress } = useProgressStore();
	const sessionStartTime = useRef(Date.now());
	const [currentProgress, setCurrentProgress] = useState(chat.progress || 0);

	const { id: chatId, title, description, progress = 0, concept_id } = chat;

	const {
		messages,
		setMessages,
		handleSubmit,
		input,
		setInput,
		append,
		isLoading,
		stop,
		reload,
		data: streamingData,
	} = useChat({
		id: chatId,
		body: { chatId, userId, title, description },
		api: '/api/chat',
		initialMessages,
		sendExtraMessageFields: true,
		onFinish: async (message) => {
			mutate('/api/history');

			// Only check for progress updates when a new message is finished
			if (message && concept_id && message.role === 'assistant') {
				// Check if the message contains positive feedback
				if (containsPositiveFeedback(message.content)) {
					// Calculate new progress (cap at 100%)
					const newProgress = Math.min(
						100,
						currentProgress + PROGRESS_INCREMENT
					);

					// Only update if there's an actual increase
					if (newProgress > currentProgress) {
						try {
							const result = await updateConceptProgress({
								conceptId: concept_id,
								userId,
								progress: newProgress,
							});

							if (result.success) {
								setCurrentProgress(newProgress);
								setConceptProgress(concept_id, newProgress);

								// Check if this is linked to a learning path
								const isLearningPathNode =
									chat.learning_path_node_id !== undefined &&
									chat.learning_path_node_id !== null;

								toast({
									title: 'Progress updated!',
									description: `Great job! Your progress has increased to ${newProgress}%${
										isLearningPathNode
											? '. Your learning path has also been updated.'
											: ''
									}`,
								});

								// Refresh the concept data
								mutate(`/api/concepts/${concept_id}`);
							}
						} catch (error) {
							console.error('Error updating progress:', error);
						}
					}
				}
			}
		},
	});

	// Function to check if a message contains positive feedback
	const containsPositiveFeedback = useCallback((message: string): boolean => {
		const positivePhrases = [
			"that's correct",
			'that is correct',
			"you're right",
			'you are right',
			'exactly',
			'well done',
			'perfect',
			'great job',
			'excellent',
			'spot on',
			'absolutely right',
			'you got it',
			"that's right",
			'that is right',
			'correct answer',
			"you're correct",
			'you are correct',
			'good job',
			'nicely done',
			'you understand',
			"you've got it",
			'you have got it',
			'bravo',
			'impressive',
			'Great explanation!',
		];

		const lowerCaseMessage = message.toLowerCase();
		return positivePhrases.some((phrase) =>
			lowerCaseMessage.includes(phrase)
		);
	}, []);

	useEffect(() => {
		setTitle(title);

		return () => {
			setTitle('Feynman Learning');
		};
	}, [title, setTitle]);

	// Initialize progress in store if not already set
	useEffect(() => {
		if (concept_id && progress !== undefined) {
			// Only update store if the value is different
			if (conceptProgress[concept_id] !== progress) {
				setConceptProgress(concept_id, progress);
			}

			// Update local state
			setCurrentProgress(progress);
		}
	}, [concept_id, progress, conceptProgress, setConceptProgress]);

	// Track session time and update when user leaves
	useEffect(() => {
		// Reset session start time when component mounts
		sessionStartTime.current = Date.now();

		// Update session time when component unmounts
		return () => {
			const sessionDuration = Math.floor(
				(Date.now() - sessionStartTime.current) / 1000 / 60
			);
			if (sessionDuration > 0) {
				updateUserSessionTime({
					userId,
					sessionTime: sessionDuration,
				});
			}
		};
	}, [userId]);

	// Update the updateProgress function to also update the store
	const updateProgress = async (newProgress: number) => {
		// Use the chat ID directly instead of concept_id
		// If concept_id is available, use it as a fallback
		const progressId = chatId || concept_id;

		if (progressId && userId) {
			try {
				const result = await updateConceptProgress({
					conceptId: progressId,
					userId,
					progress: newProgress,
				});

				if (result.success) {
					setCurrentProgress(newProgress);

					// If concept_id is available, update the concept progress in the store
					if (concept_id) {
						setConceptProgress(concept_id, newProgress);
					}

					// Check if this is linked to a learning path
					const isLearningPathNode =
						result.learningPathNodeUpdated || false;
					const learningPathId = result.learningPathId as
						| string
						| undefined;

					// If a learning path node was updated, try to refresh the learning path data
					if (isLearningPathNode && learningPathId) {
						try {
							// Import and use the learning path store to refresh data
							const { useLearningPathStore } = await import(
								'@/store/learning-path-store'
							);

							// Get the store methods (this won't trigger a re-render)
							const loadPaths =
								useLearningPathStore.getState().loadPaths;
							const selectPath =
								useLearningPathStore.getState().selectPath;

							// Refresh both the paths list and the current path data if available
							await loadPaths();
							await selectPath(learningPathId);
						} catch (error) {
							console.error(
								'Error refreshing learning path data:',
								error
							);
						}
					}

					toast({
						title: 'Progress updated!',
						description: `Great job! Your progress has increased to ${newProgress}%${
							isLearningPathNode
								? '. Your learning path has also been updated.'
								: ''
						}`,
					});
				}
			} catch (error) {
				console.error('Error updating progress:', error);
				toast({
					title: 'Error',
					description: 'Failed to update progress. Please try again.',
					variant: 'destructive',
				});
			}
		}
	};

	// Update the detectPositiveFeedback function to use the new updateProgress function
	const detectPositiveFeedback = (content: string) => {
		const positivePatterns = [
			/great explanation/i,
			/well explained/i,
			/good job/i,
			/excellent/i,
			/perfect/i,
			/thank you/i,
			/thanks/i,
			/helpful/i,
			/appreciate/i,
			/understood/i,
			/makes sense/i,
			/clear/i,
		];

		const isPositive = positivePatterns.some((pattern) =>
			pattern.test(content)
		);

		if (isPositive && concept_id) {
			const newProgress = Math.min(
				currentProgress + PROGRESS_INCREMENT,
				100
			);
			updateProgress(newProgress);
		}
	};

	return (
		<div className='relative flex flex-row min-w-0 max-h-[97vh] bg-background'>
			<div className='flex-grow flex flex-col'>
				<div className='absolute top-4 left-4 z-10'>
					<Link
						href={`/learning-path/${chat.learning_path_id}`}
						className='flex items-center gap-1 text-md font-medium hover:opacity-80 transition-opacity'
					>
						<ChevronLeft size={20} />
						Learning Path
					</Link>
				</div>
				{/* <div className='absolute top-4 right-8 z-10'>
					<Timer initialMinutes={TIMER_DURATION} />
				</div> */}
				<ChatMessages
					chatId={chatId}
					createdAt={chat.created_at}
					messages={messages || []}
					setMessages={setMessages}
					isLoading={isLoading}
					reload={reload}
					userId={userId}
					conceptId={concept_id}
					currentProgress={currentProgress}
				/>

				<div className='fixed bottom-0 left-0 right-0 flex mx-auto px-2 bg-background pb-3 pt-1 md:pb-6 w-full md:w-[calc(100%-300px)]'>
					<ChatBar
						handleSubmit={handleSubmit}
						attachments={attachments}
						setAttachments={setAttachments}
						input={input}
						setInput={setInput}
						isLoading={isLoading}
						reload={reload}
						stop={stop}
						userId={userId}
						messages={messages || []}
						chatId={chatId}
					/>
				</div>
			</div>

			{/* Desktop Learning Path Sidebar */}
			<div className='hidden md:block border-l'>
				<div className='w-[300px]'>
					<LearningPathSidebar
						conceptId={concept_id || chatId}
						userId={userId}
						progress={currentProgress}
						title={title}
						description={description}
					/>
				</div>
			</div>

			{/* Mobile Learning Path Sidebar */}
			<MobileLearningPathSidebar
				conceptId={concept_id || chatId}
				userId={userId}
				progress={currentProgress}
				title={title}
				description={description}
			/>
		</div>
	);
}

export default ChatWindow;
