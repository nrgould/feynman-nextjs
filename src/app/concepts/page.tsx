import { currentUser } from '@clerk/nextjs/server';
import ConceptsGenerator from './ConceptsGenerator';
import { getUserConcepts } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SignedOut, RedirectToSignIn, SignedIn } from '@clerk/nextjs';

const CONCEPTS_TO_FETCH = 10;

const Concepts = async () => {
	const user = await currentUser();
	const concepts = await getUserConcepts(CONCEPTS_TO_FETCH, 0);

	return (
		<>
			{user && (
				<SignedIn>
					<ScrollArea>
						<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center h-dvh px-4 pb-48'>
							<ConceptsGenerator
								initialConcepts={concepts}
								userId={user.id}
							/>
						</div>
					</ScrollArea>
				</SignedIn>
			)}
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
		</>
	);
};

export default Concepts;
