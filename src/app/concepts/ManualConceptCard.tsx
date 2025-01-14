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
import { Brain } from 'lucide-react';
import { useState } from 'react';
import { saveConcept } from './actions';
import { generateUUID } from '@/lib/utils';

const subjects = [
	'Mathematics',
	'Physics',
	'Chemistry',
	'Biology',
	'Computer Science',
	'History',
	'Literature',
	'Other',
];

const ManualConceptCard = ({
	userId,
	setConcepts,
	concepts,
}: {
	userId: string;
	setConcepts: (
		concepts: {
			title: string;
			description: string;
			subject: string;
			id: string;
		}[]
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (title && description && subject) {
			const id = generateUUID();

			setConcepts([{ title, description, subject, id }, ...concepts]);
			setTitle('');
			setDescription('');
			setSubject('');
			saveConcept({ title, description, subject, id }, userId);
		}
	};

	return (
		<Card className='w-full max-w-md h-full border-0 sm:border sm:h-fit my-12'>
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
						Add a concept you want to learn about
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
								<SelectValue placeholder='Select a subject' />
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
						/>
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={!title || !description || !subject}
					>
						Create
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default ManualConceptCard;
