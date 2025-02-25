import { currentUser } from '@clerk/nextjs/server';
import ConceptsGenerator from './ConceptsGenerator';
import { getUserConcepts } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SignedOut, RedirectToSignIn, SignedIn } from '@clerk/nextjs';
import MobileConceptsNav from './MobileConceptsNav';

const CONCEPTS_TO_FETCH = 10;

const Concepts = async () => {
	const user = await currentUser();
	const concepts = await getUserConcepts(CONCEPTS_TO_FETCH, 0);

	return (
		<>
			{user && (
				<SignedIn>
					<div className='flex min-h-screen'>
						{/* Concepts sidebar - hidden on mobile */}
						<div className='w-[300px] border-r hidden md:block'>
							<ScrollArea className='h-screen'>
								<div className='p-4 border-b'>
									<h2 className='font-semibold'>
										Your Concepts
									</h2>
								</div>
								<div className='p-4'>
									<ConceptsGenerator
										initialConcepts={concepts}
										userId={user.id}
										variant='sidebar'
									/>
								</div>
							</ScrollArea>
						</div>

						{/* Main content area */}
						<div className='flex-1'>
							{/* Mobile navigation - only visible on mobile */}
							<div className='md:hidden'>
								<MobileConceptsNav
									initialConcepts={concepts}
									userId={user.id}
								/>
							</div>

							{/* Desktop view - hidden on mobile */}
							<div className='hidden md:block'>
								<ScrollArea className='h-screen'>
									<div className='max-w-5xl mx-auto px-4 py-8'>
										<ConceptsGenerator
											initialConcepts={concepts}
											userId={user.id}
											variant='main'
										/>
									</div>
								</ScrollArea>
							</div>
						</div>
					</div>
				</SignedIn>
			)}
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
		</>
	);
};

export default Concepts;
