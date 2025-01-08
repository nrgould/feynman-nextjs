import { redirect } from 'next/navigation';
import ConceptsGenerator from './ConceptsGenerator';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserConcepts } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';

const Concepts = async () => {
	const session = await getSession();

	if (!session) {
		return redirect('/api/auth/login');
	}

	const concepts = await getUserConcepts(session.user.sid, 10);

	return (
		<ScrollArea className='h-dvh'>
			<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center overflow-y-scroll h-dvh'>
				<ConceptsGenerator
					initialConcepts={concepts}
					user={session.user}
				/>
			</div>
		</ScrollArea>
	);
};

export default Concepts;
