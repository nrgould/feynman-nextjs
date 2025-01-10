import { currentUser } from '@clerk/nextjs/server';
import ConceptsGenerator from './ConceptsGenerator';
import { getUserConcepts } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SignedOut, RedirectToSignIn, SignedIn } from '@clerk/nextjs';

const Concepts = async () => {
	const user = await currentUser();
	const concepts = await getUserConcepts(user!.id, 10);

	return (
		<>
			{user && (
				<SignedIn>
					<ScrollArea className='h-dvh'>
						<div className='pt-[3vh]flex flex-col gap-4 items-center justify-center overflow-y-scroll h-dvh'>
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
