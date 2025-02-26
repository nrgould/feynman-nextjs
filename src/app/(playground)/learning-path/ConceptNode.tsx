'use client';

import { Handle, Position } from '@xyflow/react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, BookOpen } from 'lucide-react';
import { LearningPathNode } from '@/lib/learning-path-schemas';

interface ConceptNodeProps {
	data: {
		node: LearningPathNode;
		onProgressChange?: (id: string, progress: number) => void;
	};
	selected: boolean;
}

export function ConceptNode({ data, selected }: ConceptNodeProps) {
	const { node, onProgressChange } = data;

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

	const difficultyClass = getDifficultyColor(node.difficulty);
	const gradeInfo = getGradeInfo(node.grade);

	return (
		<div
			className={`p-4 rounded-lg shadow-md bg-white border-2 ${selected ? 'border-primary' : 'border-gray-200'} w-[250px]`}
		>
			{/* Source handle */}
			<Handle
				type='source'
				position={Position.Right}
				className='w-3 h-3 bg-primary border-2 border-white'
			/>

			{/* Target handle */}
			<Handle
				type='target'
				position={Position.Left}
				className='w-3 h-3 bg-primary border-2 border-white'
			/>

			<div className='space-y-3'>
				{/* Concept title */}
				<h3 className='font-semibold text-gray-800'>{node.concept}</h3>

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

					<Badge
						variant='outline'
						className='bg-violet-50 text-violet-700 border-violet-200'
					>
						<BookOpen className='w-3 h-3 mr-1' />
						Grade:{' '}
						<span className={`ml-1 font-bold ${gradeInfo.color}`}>
							{gradeInfo.letter}
						</span>
					</Badge>
				</div>

				{/* Progress section */}
				<div className='space-y-1'>
					<div className='flex justify-between text-xs text-gray-600'>
						<span>Progress</span>
						<span>{node.progress}%</span>
					</div>
					<Progress value={node.progress} className='h-2' />
				</div>
			</div>
		</div>
	);
}
