'use client';

import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { generateMethods } from '@/app/actions';
import { Textarea } from '../ui/textarea';
import { MathSymbolToolbar } from '@/app/(playground)/drag-drop-math/MathSymbolToolbar';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TextInputProblemProps {
	onProblemSubmit: (problem: string, methods: string[]) => void;
	setLoading: (loading: boolean) => void;
}

export function TextInputProblem({
	onProblemSubmit,
	setLoading,
}: TextInputProblemProps) {
	const [problemInput, setProblemInput] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [showSymbols, setShowSymbols] = useState(false);

	const handleSymbolClick = (symbol: string) => {
		const textarea = textareaRef.current;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = textarea.value;
			const newText =
				text.substring(0, start) + symbol + text.substring(end);
			setProblemInput(newText);
			textarea.focus();
			setTimeout(
				() =>
					textarea.setSelectionRange(
						start + symbol.length,
						start + symbol.length
					),
				0
			);
		}
	};

	const handleSubmit = async () => {
		if (!problemInput.trim()) {
			alert('Please enter a math problem.');
			return;
		}
		setLoading(true);
		try {
			const methods = await generateMethods(problemInput);
			onProblemSubmit(problemInput, methods);
			setProblemInput('');
		} catch (error: any) {
			console.error('Error submitting text problem:', error);
			alert(`Error: ${error.message || 'An unknown error occurred.'}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col gap-4 p-4 border rounded-lg'>
			<h2 className='text-xl font-semibold text-center'>
				Enter Math Problem
			</h2>

			<Textarea
				ref={textareaRef}
				value={problemInput}
				onChange={(e) => setProblemInput(e.target.value)}
				placeholder='Type your math problem here, e.g., Differentiate f(x) = 3x^2 + 5x - 4'
				className='w-full p-2 border rounded-md min-h-[100px]'
			/>
			<Button
				variant='ghost'
				type='button'
				onClick={() => setShowSymbols(!showSymbols)}
				className='flex items-center justify-center gap-2'
			>
				{showSymbols ? 'Hide Math Symbols' : 'Show Math Symbols'}
				{showSymbols ? (
					<ChevronUp className='h-4 w-4' />
				) : (
					<ChevronDown className='h-4 w-4' />
				)}
			</Button>
			{showSymbols && (
				<MathSymbolToolbar onSymbolClick={handleSymbolClick} />
			)}
			<Button onClick={handleSubmit} className='w-full'>
				Start Solving
			</Button>
		</div>
	);
}
