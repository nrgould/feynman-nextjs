import { redirect } from 'next/navigation';
import ConceptsGenerator from './ConceptsGenerator';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getUserConcepts } from './actions';

// const Concepts = withPageAuthRequired(async () => {
// 	return (
// 		<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center overflow-y-scroll h-dvh'>
// 			<ConceptsGenerator />
// 		</div>
// 	);
// }, { returnTo: '/concepts' });

const Concepts = async () => {
	const session = await getSession();

	if (!session) {
		return redirect('/api/auth/login');
	}

	const concepts = await getUserConcepts(session.user.sid, 10);

	return (
		<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center overflow-y-scroll h-dvh'>
			<ConceptsGenerator initialConcepts={concepts} user={session.user} />
		</div>
	);
};

export default Concepts;
