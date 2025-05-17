'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Copy } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface ShareSolutionButtonProps {
	problemId: string;
	problemTitle?: string;
	buttonVariant?:
		| 'default'
		| 'ghost'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'link'
		| null
		| undefined;
	buttonClassName?: string;
}

export default function ShareSolutionButton({
	problemId,
	problemTitle = 'Math Problem Solution',
	buttonVariant = 'ghost',
	buttonClassName = 'justify-start',
}: ShareSolutionButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [computedShareUrl, setComputedShareUrl] = useState('');
	const { toast } = useToast();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setComputedShareUrl(
				`${window.location.origin}/problems/${problemId}`
			);
		}
	}, [problemId]);

	const handleNativeShare = async () => {
		if (!computedShareUrl) return;

		const shareData = {
			title: problemTitle || 'Math Problem Solution',
			text: `Check out this math problem: ${problemTitle || 'see the solution'}`,
			url: computedShareUrl,
		};

		console.log('Attempting native share with:', shareData);

		try {
			await navigator.share(shareData);
			console.log('Native share successful or dialog opened by user.');
		} catch (error) {
			console.error('Error using Web Share API:', error);
			if (error instanceof Error && error.name !== 'AbortError') {
				setIsDialogOpen(true);
			}
		}
	};

	const handleCopyLink = async () => {
		if (!computedShareUrl) return;
		try {
			await navigator.clipboard.writeText(computedShareUrl);
			toast({
				title: 'Link Copied!',
				description:
					'The problem link has been copied to your clipboard.',
				duration: 3000,
			});
		} catch (error) {
			console.error('Failed to copy link:', error);
			toast({
				title: 'Error',
				description: 'Could not copy link to clipboard.',
				variant: 'destructive',
				duration: 3000,
			});
		}
	};

	const handleClick = () => {
		if (
			typeof navigator.share === 'function' &&
			typeof navigator.canShare === 'function' &&
			navigator.canShare({ url: computedShareUrl })
		) {
			console.log('Web Share API seems available and can share URL.');
			handleNativeShare();
		} else if (typeof navigator.share === 'function') {
			console.log(
				'navigator.share exists, but navigator.canShare is false or unavailable. Attempting share anyway.'
			);
			handleNativeShare();
		} else {
			console.log('Web Share API not available. Opening dialog.');
			setIsDialogOpen(true);
		}
	};

	if (!computedShareUrl) {
		return (
			<Button
				variant={buttonVariant}
				className={buttonClassName}
				disabled
			>
				<Share className='mr-1 h-4 w-4' /> Share Solution
				<span className='text-xs text-muted-foreground ml-1'>
					(5 problems free)
				</span>
			</Button>
		);
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<Button
				onClick={handleClick}
				variant={buttonVariant}
				className={buttonClassName}
			>
				<Share className='mr-1 h-4 w-4' /> Share Solution
				<span className='text-xs text-muted-foreground ml-1'>
					(5 problems free)
				</span>
			</Button>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Share this problem</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col space-y-4 py-2'>
					<p className='text-sm text-muted-foreground'>
						Anyone with this link can view the problem and its
						solution steps.
					</p>
					<div className='flex items-center space-x-2'>
						<div className='grid flex-1 gap-2'>
							<Label htmlFor='link' className='sr-only'>
								Link
							</Label>
							<Input
								id='link'
								defaultValue={computedShareUrl}
								readOnly
								onFocus={(e) => e.target.select()}
								className='text-sm'
							/>
						</div>
						<Button
							type='button'
							size='sm'
							className='px-3'
							onClick={handleCopyLink}
						>
							<span className='sr-only'>Copy</span>
							<Copy className='h-4 w-4' />
						</Button>
					</div>
				</div>
				<DialogFooter className='sm:justify-start'>
					<DialogClose asChild>
						<Button type='button' variant='secondary'>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
