import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Send, RotateCwSquare, User2Icon, PlusIcon, Share } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

interface ProblemSolvedDisplayProps {
	remainingProblems: number;
	lastSavedProblemId: string | null;
	reset: () => void;
	user: any;
}

export default function ProblemSolvedDisplay({
	remainingProblems,
	lastSavedProblemId,
	reset,
	user,
}: ProblemSolvedDisplayProps) {
	return (
		<div className='flex flex-col p-4 justify-between items-center h-full gap-4 px-4'>
			<h2 className='text-center text-lg font-semibold'>
				Problem solved!
			</h2>
			{user?.publicMetadata?.account_type !== 'plus' && (
				<div className='flex flex-col gap-2 max-w-sm'>
					<p className='text-sm text-muted-foreground'>
						You have {remainingProblems} problems left.
					</p>
					<Progress value={remainingProblems} />
				</div>
			)}
			<div className='w-full flex justify-center items-center gap-1 flex-wrap'>
				<SignedIn>
					<div className='flex flex-col mt-2 gap-1 items-flex justify-evenly'>
						<Button variant='default' size='lg' onClick={reset}>
							<RotateCwSquare className='mr-1 h-4 w-4' /> Do
							Another
						</Button>
						{lastSavedProblemId && (
							<Button
								asChild
								variant='ghost'
								className='justify-start'
							>
								<Link href={`/problems/${lastSavedProblemId}`}>
									<Share className='mr-1 h-4 w-4' /> Share
									Solution
									<span className='text-xs text-muted-foreground'>
										(5 problems free)
									</span>
								</Link>
							</Button>
						)}
						{remainingProblems <= 5 &&
							user?.publicMetadata?.account_type !== 'plus' && (
								<Button
									variant='ghost'
									asChild
									className='justify-start'
								>
									<Link href='/plans'>
										<PlusIcon className='mr-1 h-4 w-4' />{' '}
										Get more problems
									</Link>
								</Button>
							)}
					</div>
				</SignedIn>
				<SignedOut>
					<SignInButton mode='modal'>
						<Button>
							<User2Icon className='mr-2 h-4 w-4' /> Sign up to
							continue
						</Button>
					</SignInButton>
				</SignedOut>
			</div>
		</div>
	);
}
