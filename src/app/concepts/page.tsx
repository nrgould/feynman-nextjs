import ConceptsGenerator from './ConceptsGenerator';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

// const Concepts = withPageAuthRequired(async () => {
// 	return (
// 		<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center overflow-y-scroll h-dvh'>
// 			<ConceptsGenerator />
// 		</div>
// 	);
// }, { returnTo: '/concepts' });

const Concepts = async () => {
	return (
		<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center overflow-y-scroll h-dvh'>
			<ConceptsGenerator />
		</div>
	);
};

export default Concepts;
