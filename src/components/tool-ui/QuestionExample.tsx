'use client';

import React, { useState } from 'react';
import Question from './question';
import { tools } from '@/lib/ai/tools';

// Define the type for question data
interface QuestionData {
	question: string;
	options: Array<{
		text: string;
		isCorrect: boolean;
	}>;
	explanation: string;
}

export default function QuestionExample() {
	const [loading, setLoading] = useState(false);
	const [questionData, setQuestionData] = useState<QuestionData | null>(null);
	const [error, setError] = useState('');

	const [concept, setConcept] = useState('');
	const [description, setDescription] = useState('');

	// Basic example question
	const basicQuestionData: QuestionData = {
		question: 'What is the result of factoring x² + 5x + 6?',
		options: [
			{ text: '(x + 2)(x + 3)', isCorrect: true },
			{ text: '(x + 1)(x + 6)', isCorrect: false },
			{ text: '(x - 2)(x - 3)', isCorrect: false },
			{ text: '(x + 6)(x - 1)', isCorrect: false },
		],
		explanation:
			'To factor x² + 5x + 6, we need to find two numbers that multiply to give 6 and add up to 5. These numbers are 2 and 3, so the factored form is (x + 2)(x + 3).',
	};

	// Advanced example question
	const advancedQuestionData: QuestionData = {
		question:
			'Which of the following is the correct factorization of 2x³ - 6x² - 8x?',
		options: [
			{ text: '2x(x² - 3x - 4)', isCorrect: true },
			{ text: '2x(x - 3)(x + 4)', isCorrect: false },
			{ text: '2(x³ - 3x² - 4x)', isCorrect: false },
			{ text: '2x(x - 2)(x - 2)', isCorrect: false },
		],
		explanation:
			'To factor 2x³ - 6x² - 8x, first factor out the common factor 2x: 2x(x² - 3x - 4). The trinomial x² - 3x - 4 cannot be factored further using real numbers, so 2x(x² - 3x - 4) is the complete factorization.',
	};

	const loadBasicExample = () => {
		setQuestionData(basicQuestionData);
		setError('');
	};

	const loadAdvancedExample = () => {
		setQuestionData(advancedQuestionData);
		setError('');
	};

	const generateQuestion = async () => {
		if (!concept || !description) {
			setError('Please provide both concept and description');
			return;
		}

		setLoading(true);
		setError('');

		try {
			// For now, just use the example data
			setQuestionData(basicQuestionData);

			// Commented out the actual API call until we can fix the integration
			/*
			const result = await tools.generateQuestion.execute({
				concept,
				description,
			});
			
			// The result object structure needs to be properly handled
			setQuestionData({
				question: result.question,
				options: result.options,
				explanation: result.explanation
			});
			*/
		} catch (err) {
			console.error('Error generating question:', err);
			setError('Failed to generate question. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='max-w-2xl mx-auto p-6'>
			<h2 className='text-2xl font-bold mb-6'>Question Generator</h2>

			<div className='space-y-4 mb-6'>
				<div>
					<label
						htmlFor='concept'
						className='block text-sm font-medium mb-1'
					>
						Concept
					</label>
					<input
						id='concept'
						type='text'
						value={concept}
						onChange={(e) => setConcept(e.target.value)}
						placeholder='e.g., Factoring in Algebra'
						className='w-full p-2 border rounded-md'
					/>
				</div>

				<div>
					<label
						htmlFor='description'
						className='block text-sm font-medium mb-1'
					>
						Description
					</label>
					<textarea
						id='description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Provide a detailed description of the concept...'
						className='w-full p-2 border rounded-md h-24'
					/>
				</div>
			</div>

			{error && (
				<div className='bg-red-100 text-red-700 p-3 rounded-md mb-4'>
					{error}
				</div>
			)}

			<div className='flex gap-4 flex-wrap'>
				<button
					onClick={generateQuestion}
					disabled={loading}
					className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed'
				>
					{loading ? 'Generating...' : 'Generate Question'}
				</button>

				<button
					onClick={loadBasicExample}
					className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
				>
					Load Basic Example
				</button>

				<button
					onClick={loadAdvancedExample}
					className='bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600'
				>
					Load Advanced Example
				</button>
			</div>

			{questionData && (
				<div className='mt-8'>
					<Question
						question={questionData.question}
						options={questionData.options}
						explanation={questionData.explanation}
					/>
				</div>
			)}
		</div>
	);
}
