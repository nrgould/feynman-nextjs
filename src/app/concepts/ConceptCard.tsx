import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createChatFromConcept } from './actions';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

const ConceptCard = ({ concept, userId }: { concept: any; userId: string }) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		createChatFromConcept(userId, concept.title, concept.description);
	};

	console.log(concept, userId);

	return (
		<Card className='max-w-sm'>
			<CardHeader>
				<CardTitle>{concept.title}</CardTitle>
				{/* <CardDescription>{concept.difficulty}</CardDescription> */}
			</CardHeader>
			<CardContent className='gap-2'>
				<p>{concept.description}</p>
				<div className='flex flex-col gap-2 max-w-[50%] mt-4'>
					<Label>Progress: 0%</Label>
					<Progress color='secondary' className='h-2' value={50} />
				</div>
			</CardContent>
			<CardFooter>
				<Button variant='outline' onClick={handleClick}>
					Start Learning
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ConceptCard;
