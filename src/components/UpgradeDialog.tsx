'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, X } from 'lucide-react';
import Link from 'next/link';

interface UpgradeDialogProps {
	trigger?: React.ReactNode;
	title?: string;
	description?: string;
	limitType?: 'paths' | 'concepts';
	currentCount?: number;
	limit?: number | string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function UpgradeDialog({
	trigger,
	title = 'Upgrade Your Plan',
	description = 'Unlock more features and create more learning paths',
	limitType = 'paths',
	currentCount = 1,
	limit = 1,
	open,
	onOpenChange,
}: UpgradeDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(open || false);

	const handleOpenChange = (newOpen: boolean) => {
		setDialogOpen(newOpen);
		onOpenChange?.(newOpen);
	};

	const isUnlimited = limit === 'Unlimited' || limit === Infinity;

	const limitMessage =
		limitType === 'paths'
			? isUnlimited
				? 'You have unlimited learning paths available'
				: `You&apos;ve reached your limit of ${limit} learning ${limit === 1 ? 'path' : 'paths'}`
			: isUnlimited
				? 'You have unlimited concepts available for this learning path'
				: `You&apos;ve reached your limit of ${limit} ${limit === 1 ? 'concept' : 'concepts'} per learning path`;

	return (
		<Dialog
			open={open !== undefined ? open : dialogOpen}
			onOpenChange={handleOpenChange}
		>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2 text-xl'>
						<Sparkles className='h-5 w-5 text-yellow-500' />
						{title}
					</DialogTitle>
					<DialogDescription className='pt-2 text-base'>
						{description}
					</DialogDescription>
				</DialogHeader>

				<div className='py-4'>
					<div className='rounded-lg border p-4 mb-4 bg-muted/50'>
						<p className='text-sm font-medium'>{limitMessage}</p>
						<div className='mt-2 text-sm text-muted-foreground'>
							Upgrade to unlock more{' '}
							{limitType === 'paths'
								? 'learning paths'
								: 'concepts'}{' '}
							and additional features.
						</div>
					</div>

					<div className='space-y-4'>
						<div className='grid grid-cols-3 gap-4'>
							<div className='rounded-lg border p-4'>
								<h3 className='font-medium mb-2'>Free</h3>
								<ul className='space-y-2 text-sm'>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>1 Learning Path</span>
									</li>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>3 Concepts per path</span>
									</li>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>1 PDF upload</span>
									</li>
								</ul>
							</div>

							<div className='rounded-lg border border-primary p-4 bg-primary/5 relative'>
								<div className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full'>
									Recommended
								</div>
								<h3 className='font-medium mb-2'>Plus</h3>
								<ul className='space-y-2 text-sm'>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>5 Learning Paths</span>
									</li>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>Unlimited Concepts</span>
									</li>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>PDF uploads & analysis</span>
									</li>
								</ul>
							</div>

							<div className='rounded-lg border p-4'>
								<h3 className='font-medium mb-2'>Pro</h3>
								<ul className='space-y-2 text-sm'>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>Unlimited Paths</span>
									</li>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>Unlimited Concepts</span>
									</li>
									<li className='flex items-start'>
										<Check className='h-4 w-4 mr-2 text-green-500 mt-0.5' />
										<span>Priority Support</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className='flex flex-col sm:flex-row gap-2'>
					<Button
						variant='outline'
						onClick={() => handleOpenChange(false)}
						className='w-full sm:w-auto'
					>
						Maybe Later
					</Button>
					<Button asChild className='gap-1 w-full sm:w-auto'>
						<Link href='/plans'>
							<Sparkles className='h-4 w-4' />
							View Plans
						</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
