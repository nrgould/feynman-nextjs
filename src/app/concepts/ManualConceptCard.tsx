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
import { Brain } from 'lucide-react';
import { useState } from 'react';
import { saveConcept } from './actions';

const ManualConceptCard = ({
	userId,
	setConcepts,
	concepts,
}: {
	userId: string;
	setConcepts: (concepts: { title: string; description: string }[]) => void;
	concepts: { title: string; description: string }[];
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (title && description) {
			setConcepts([{ title, description }, ...concepts]);
			setTitle('');
			setDescription('');
			saveConcept({ title, description }, userId);
		}
	};

	return (
		<Card className='w-full max-w-md h-full border-0 sm:border sm:h-fit my-12'>
			<CardHeader className='text-center space-y-6'>
				<div className='mx-auto flex items-center justify-center space-x-2 text-muted-foreground'>
					<div className='rounded-full bg-green-100 p-2'>
						<Brain className='h-6 w-6 text-green-500' />
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
					<div className='space-y-2'>
						<Input
							placeholder='Concept title'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
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
						disabled={!title || !description}
					>
						Create
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default ManualConceptCard;
