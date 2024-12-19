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

const ConceptCard = ({ concept, userId }: { concept: any; userId: string }) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		createChatFromConcept(userId, concept.concept, concept.description);
	};

	console.log(concept, userId);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{concept.concept}</CardTitle>
				{/* <CardDescription>{concept.difficulty}</CardDescription> */}
			</CardHeader>
			<CardContent>
				<p>{concept.description}</p>
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
