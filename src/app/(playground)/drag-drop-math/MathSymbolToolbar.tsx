'use client';

import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MathSymbolToolbarProps {
	onSymbolClick: (symbol: string) => void;
}

export function MathSymbolToolbar({ onSymbolClick }: MathSymbolToolbarProps) {
	// Define symbol categories
	const basicSymbols = [
		{ symbol: '+', name: 'Plus' },
		{ symbol: '−', name: 'Minus' },
		{ symbol: '×', name: 'Multiply' },
		{ symbol: '÷', name: 'Divide' },
		{ symbol: '=', name: 'Equals' },
		{ symbol: '≠', name: 'Not Equal' },
		{ symbol: '≈', name: 'Approximately' },
		{ symbol: '±', name: 'Plus-Minus' },
	];

	const algebraSymbols = [
		{ symbol: 'π', name: 'Pi' },
		{ symbol: '∞', name: 'Infinity' },
		{ symbol: '√', name: 'Square Root' },
		{ symbol: '∛', name: 'Cube Root' },
		{ symbol: '^', name: 'Power' },
		{ symbol: '|x|', name: 'Absolute Value' },
		{ symbol: '()', name: 'Parentheses' },
		{ symbol: '[]', name: 'Brackets' },
		{ symbol: '{}', name: 'Braces' },
		{ symbol: 'x²', name: 'Squared' },
		{ symbol: 'x³', name: 'Cubed' },
		{ symbol: 'x⁻¹', name: 'Inverse' },
	];

	const comparisonSymbols = [
		{ symbol: '<', name: 'Less Than' },
		{ symbol: '>', name: 'Greater Than' },
		{ symbol: '≤', name: 'Less Than or Equal' },
		{ symbol: '≥', name: 'Greater Than or Equal' },
		{ symbol: '∈', name: 'Element Of' },
		{ symbol: '∉', name: 'Not Element Of' },
		{ symbol: '⊂', name: 'Subset' },
		{ symbol: '⊃', name: 'Superset' },
		{ symbol: '∩', name: 'Intersection' },
		{ symbol: '∪', name: 'Union' },
		{ symbol: '∅', name: 'Empty Set' },
		{ symbol: '∀', name: 'For All' },
		{ symbol: '∃', name: 'There Exists' },
	];

	const calcSymbols = [
		{ symbol: '∫', name: 'Integral' },
		{ symbol: '∬', name: 'Double Integral' },
		{ symbol: '∭', name: 'Triple Integral' },
		{ symbol: '∮', name: 'Contour Integral' },
		{ symbol: '∂', name: 'Partial Derivative' },
		{ symbol: '∇', name: 'Nabla/Del' },
		{ symbol: 'lim', name: 'Limit' },
		{ symbol: '∑', name: 'Summation' },
		{ symbol: '∏', name: 'Product' },
		{ symbol: 'dx', name: 'Differential x' },
		{ symbol: 'dy/dx', name: 'Derivative' },
		{ symbol: '∆', name: 'Delta/Change' },
	];

	const greekLetters = [
		{ symbol: 'α', name: 'Alpha' },
		{ symbol: 'β', name: 'Beta' },
		{ symbol: 'γ', name: 'Gamma' },
		{ symbol: 'Γ', name: 'Gamma (uppercase)' },
		{ symbol: 'δ', name: 'Delta' },
		{ symbol: 'Δ', name: 'Delta (uppercase)' },
		{ symbol: 'ε', name: 'Epsilon' },
		{ symbol: 'θ', name: 'Theta' },
		{ symbol: 'Θ', name: 'Theta (uppercase)' },
		{ symbol: 'λ', name: 'Lambda' },
		{ symbol: 'Λ', name: 'Lambda (uppercase)' },
		{ symbol: 'μ', name: 'Mu' },
		{ symbol: 'ξ', name: 'Xi' },
		{ symbol: 'π', name: 'Pi' },
		{ symbol: 'ρ', name: 'Rho' },
		{ symbol: 'σ', name: 'Sigma' },
		{ symbol: 'Σ', name: 'Sigma (uppercase)' },
		{ symbol: 'τ', name: 'Tau' },
		{ symbol: 'φ', name: 'Phi' },
		{ symbol: 'Φ', name: 'Phi (uppercase)' },
		{ symbol: 'ω', name: 'Omega' },
		{ symbol: 'Ω', name: 'Omega (uppercase)' },
	];

	const fractions = [
		{ symbol: '½', name: 'One Half' },
		{ symbol: '⅓', name: 'One Third' },
		{ symbol: '¼', name: 'One Quarter' },
		{ symbol: '⅕', name: 'One Fifth' },
		{ symbol: '⅙', name: 'One Sixth' },
		{ symbol: '⅛', name: 'One Eighth' },
		{ symbol: '⅔', name: 'Two Thirds' },
		{ symbol: '¾', name: 'Three Quarters' },
		{ symbol: 'a/b', name: 'Fraction' },
	];

	// Render a symbol button with tooltip
	const renderSymbolButton = (symbol: { symbol: string; name: string }) => (
		<TooltipProvider key={symbol.name}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='outline'
						className='h-9 w-9 text-base font-medium'
						onClick={() => onSymbolClick(symbol.symbol)}
						type='button'
					>
						{symbol.symbol}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{symbol.name}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);

	return (
		<div className='w-full border rounded-md p-2 bg-background'>
			<Tabs defaultValue='basic'>
				<TabsList className='grid grid-cols-6 mb-2'>
					<TabsTrigger value='basic'>Basic</TabsTrigger>
					<TabsTrigger value='algebra'>Algebra</TabsTrigger>
					<TabsTrigger value='comparison'>Comparison</TabsTrigger>
					<TabsTrigger value='calculus'>Calculus</TabsTrigger>
					<TabsTrigger value='greek'>Greek</TabsTrigger>
					<TabsTrigger value='fractions'>Fractions</TabsTrigger>
				</TabsList>

				<ScrollArea className='h-[68px]'>
					<TabsContent
						value='basic'
						className='flex flex-wrap gap-1 mt-0'
					>
						{basicSymbols.map(renderSymbolButton)}
					</TabsContent>

					<TabsContent
						value='algebra'
						className='flex flex-wrap gap-1 mt-0'
					>
						{algebraSymbols.map(renderSymbolButton)}
					</TabsContent>

					<TabsContent
						value='comparison'
						className='flex flex-wrap gap-1 mt-0'
					>
						{comparisonSymbols.map(renderSymbolButton)}
					</TabsContent>

					<TabsContent
						value='calculus'
						className='flex flex-wrap gap-1 mt-0'
					>
						{calcSymbols.map(renderSymbolButton)}
					</TabsContent>

					<TabsContent
						value='greek'
						className='flex flex-wrap gap-1 mt-0'
					>
						{greekLetters.map(renderSymbolButton)}
					</TabsContent>

					<TabsContent
						value='fractions'
						className='flex flex-wrap gap-1 mt-0'
					>
						{fractions.map(renderSymbolButton)}
					</TabsContent>
				</ScrollArea>
			</Tabs>
		</div>
	);
}
