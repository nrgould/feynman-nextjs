'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterval } from 'usehooks-ts';
import { useChat } from 'ai/react';
import { Input } from '@/components/ui/input';

const Learn = () => {
	const { messages, input, handleInputChange, handleSubmit } = useChat();
	const [words, setWords] = useState<string[]>([]);
	const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

	// Function to start the word streaming
	const streamWords = (text: string) => {
		const splitWords = text.split(' ');
		setWords(splitWords);
		setCurrentWordIndex(0);
	};

	// Use useInterval for timing logic
	useInterval(
		() => {
			if (currentWordIndex < words.length - 1) {
				setCurrentWordIndex((prevIndex) => prevIndex + 1);
			}
		},
		words.length > 0 && currentWordIndex < words.length - 1 ? 500 : null // 500ms per word
	);

	// Sliding window logic for previous, current, and upcoming words
	const previousWords = words
		.slice(Math.max(0, currentWordIndex - 3), currentWordIndex)
		.join(' ');
	const currentWord = words[currentWordIndex] || '';
	const upcomingWords = words
		.slice(currentWordIndex + 1, currentWordIndex + 4)
		.join(' ');

	return (
		<div className='relative flex min-h-full flex-col items-center justify-between px-24'>
			{/* Word Streaming Display */}
			<div className='relative flex-1 w-full h-[50vh]'>
				{/* Previous Words */}
				<div className='absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl w-[20rem] text-right whitespace-nowrap'>
					<AnimatePresence>
						<motion.div
							key={`${currentWordIndex}-previous`}
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.2, delay: 0.1 }} // Delayed exit for smooth transitions
						>
							{previousWords}
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Current Word */}
				<div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-5xl font-bold whitespace-nowrap w-[25rem] text-center'>
					<AnimatePresence>
						<motion.div
							key={currentWordIndex} // Stable key to avoid re-initialization
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.2 }}
						>
							{currentWord}
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Upcoming Words */}
				<div className='absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl w-[20rem] text-left whitespace-nowrap'>
					<AnimatePresence>
						<motion.div
							key={`${currentWordIndex}-upcoming`}
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.2, delay: 0.1 }} // Delayed entry for smooth transitions
						>
							{upcomingWords}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Chat Input */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
					const aiMessage = messages.find(
						(m) => m.role === 'assistant'
					);
					if (aiMessage) streamWords(aiMessage.content);
				}}
				className='w-full px-3 py-2'
			>
				<Input
					className='w-full px-3 py-2 border border-gray-700 bg-transparent rounded-lg'
					value={input}
					placeholder='Ask me anything...'
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
};

export default Learn;
