import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { createConversationAction } from '../chat/actions';

const ConceptCard = ({ concept }: { concept: any }) => {
	const handleClick = () => {
		createConversationAction(concept.concept);
	};

	return (
		<Card
			onClick={handleClick}
			className='cursor-pointer hover:shadow-lg transition'
		>
			<CardHeader>
				<CardTitle>{concept.concept}</CardTitle>
				{/* <CardDescription>{concept.difficulty}</CardDescription> */}
			</CardHeader>
			<CardContent>
				<p>{concept.description}</p>
			</CardContent>
			<CardFooter>
				<a href={`/concepts/${concept.concept}`}>Start Learning</a>
			</CardFooter>
		</Card>
	);
};

export default ConceptCard;
