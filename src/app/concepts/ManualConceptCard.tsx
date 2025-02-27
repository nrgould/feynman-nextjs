import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	CardHeader,
	CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Brain, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { saveConcept } from './actions';
import { generateUUID } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const subjects = [
	'Algebra',
	'Geometry',
	'Trigonometry',
	'Pre-Calculus',
	'Statistics',
	'Number Theory',
	'Functions',
	'Probability',
	'Calculus',
	'Linear Algebra',
	'Discrete Mathematics',
	'Computer Science',
	'Physics',
];

const ManualConceptCard = ({
	setConcepts,
	concepts,
	userId,
}: {
	userId: string;
	setConcepts: (
		concepts:
			| {
					title: string;
					description: string;
					subject: string;
					id: string;
			  }[]
			| ((prevConcepts: any[]) => any[])
	) => void;
	concepts: {
		title: string;
		description: string;
		subject: string;
		id: string;
	}[];
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [subject, setSubject] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		if (title && description && subject) {
			const id = generateUUID();
			const newConcept = { title, description, subject, id };

			try {
				await saveConcept(newConcept);

				// Update the concepts state with the new concept
				setConcepts((prevConcepts) => {
					// Check if the concept already exists
					const exists = prevConcepts.some((c) => c.id === id);
					if (exists) return prevConcepts;

					// Add the new concept to the beginning of the list
					return [
						{
							...newConcept,
							is_active: false,
							progress: 0,
							_id: id, // Ensure _id is set for consistency
						},
						...prevConcepts,
					];
				});

				// Show success toast
				toast({
					title: 'Concept created!',
					description: 'Your new concept has been added to the list.',
				});

				// Reset form
				setTitle('');
				setDescription('');
				setSubject('');
			} catch (error) {
				console.error('Error saving concept:', error);
				toast({
					title: 'Failed to create concept',
					description: 'Please try again.',
					variant: 'destructive',
				});
			}
		}
		setLoading(false);
	};

	return (
		<Card className='w-full max-w-md h-full border-0 sm:border sm:h-fit my-4 sm:my-6'>
			<CardHeader className='text-center space-y-6'>
				<div className='mx-auto flex items-center justify-center space-x-2 text-muted-foreground'>
					<div className='rounded-full bg-gradient-to-b from-emerald-400 from-50% to-emerald-500 border border-emerald-500 p-3'>
						<Brain className='h-5 w-5 text-white' />
					</div>
				</div>
				<div className='space-y-2'>
					<CardTitle className='text-2xl font-bold'>
						Add Concept
					</CardTitle>
					<CardDescription className='text-base'>
						Add a concept you want to learn
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2 flex flex-row gap-2 items-center justify-center'>
						<Input
							placeholder='Name'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							className='mt-2'
						/>
						<Select
							value={subject}
							onValueChange={setSubject}
							required
						>
							<SelectTrigger>
								<SelectValue placeholder='Select a topic' />
							</SelectTrigger>
							<SelectContent>
								{subjects.map((subject) => (
									<SelectItem key={subject} value={subject}>
										{subject}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-2'>
						<Textarea
							placeholder='Describe the concept...'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className='min-h-[80px] resize-none'
							maxLength={500}
						/>
						<div className='flex justify-end'>
							<span className='text-xs text-muted-foreground'>
								{description.length}/500 characters
							</span>
						</div>
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={!title || !description || !subject}
					>
						{loading ? (
							<span className='flex items-center space-x-2'>
								<Loader2 className='h-4 w-4 animate-spin' />
							</span>
						) : (
							'Create'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default ManualConceptCard;
