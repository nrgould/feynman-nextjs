'use client';

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createChatFromConcept } from '../../app/concepts/actions';
import { redirect } from 'next/navigation';
import {
	Ellipsis,
	Bolt,
	Trash2,
	Plus,
	Pencil,
	RotateCcw,
	ThumbsUp,
	ThumbsDown,
	Sparkles,
	Loader2,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { generateUUID } from '@/lib/utils';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogAction,
	AlertDialogFooter,
	AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const ConceptCard = ({
	concept,
	conceptLimitReached,
	isLoading = false,
	onClick,
}: {
	concept: any;
	conceptLimitReached: boolean;
	isLoading?: boolean;
	onClick?: () => void;
}) => {
	const [loading, setLoading] = useState(false);

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (onClick) {
			onClick();
			return;
		}

		// If no external click handler is provided, use the default behavior
		setLoading(true);

		if (concept.is_active && concept.chat_id) {
			window.location.href = `/chat/${concept.chat_id}`;
			return;
		}

		const chatId = generateUUID();

		try {
			const { success, error } = await createChatFromConcept(
				concept,
				chatId
			);
			if (error) {
				toast({
					title: 'Failed to create chat',
					description: 'Try reloading the page',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Failed to create chat',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (e: React.MouseEvent) => {};

	const progress = concept.progress || 0;
	const active = concept.is_active || false;
	const isDisabled = !active && conceptLimitReached;

	return (
		<Card
			className={`w-full max-w-full md:max-w-sm ${
				isDisabled ? 'bg-zinc-100' : ''
			}`}
		>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<CardTitle
						className={`text-lg flex items-center ${
							isDisabled
								? 'text-zinc-400'
								: 'text-zinc-900 font-bold'
						}`}
					>
						{concept.title}
					</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger className='p-1 rounded-md mr-2'>
							<Ellipsis size={18} color='gray' />
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56 font-medium'>
							{isDisabled && (
								<>
									<DropdownMenuItem
										onClick={() => redirect('/upgrade')}
										className='flex justify-between items-center text-violet-500 rounded-md p-2 cursor-pointer'
									>
										GET PRO TO UNLOCK <Sparkles size={18} />
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}
							<DropdownMenuLabel className='flex justify-between items-center'>
								Options <Bolt size={16} />
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex justify-between items-center'>
								Create quiz <Plus size={16} />
							</DropdownMenuItem>
							<DropdownMenuItem className='flex justify-between items-center'>
								Edit Details
								<Pencil size={16} />
							</DropdownMenuItem>
							<DropdownMenuItem className='flex justify-between items-center'>
								Reset progress
								<RotateCcw size={16} />
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='flex justify-between items-center'>
								I enjoyed this
								<ThumbsUp size={16} />
							</DropdownMenuItem>
							<DropdownMenuItem className='flex justify-between items-center'>
								I didn&apos;t enjoy this
								<ThumbsDown size={16} />
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
							>
								<DeleteDialog handleDelete={handleDelete} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent className='gap-2 space-y-2'>
				<CardDescription className='line-clamp-2 text-sm text-muted-foreground'>
					{concept.description}
				</CardDescription>
				{concept.subject && (
					<p className='line-clamp-2 text-xs text-muted-foreground font-medium bg-zinc-50 rounded-md px-2 py-1 inline-block'>
						{concept.subject}
					</p>
				)}

				{progress > 0 && (
					<div className='mt-3 space-y-1'>
						<div className='flex justify-between items-center'>
							<span className='text-xs text-muted-foreground'>
								Progress
							</span>
							<span className='text-xs font-medium'>
								{progress}%
							</span>
						</div>
						<Progress value={progress} className='h-1.5' />
					</div>
				)}
			</CardContent>
			<CardFooter className='flex justify-between items-end flex-1 pt-2'>
				<Button
					variant={active ? 'secondary' : 'outline'}
					onClick={handleClick}
					className='w-1/3'
					disabled={isDisabled || isLoading || loading}
				>
					{isLoading || loading ? (
						<span className='flex items-center space-x-2'>
							<Loader2 className='h-4 w-4 animate-spin' />
						</span>
					) : active ? (
						'Continue'
					) : (
						'Start'
					)}
				</Button>
				{active && (
					<span className='text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded'>
						Active
					</span>
				)}
			</CardFooter>
		</Card>
	);
};

const DeleteDialog = ({
	handleDelete,
}: {
	handleDelete: (e: React.MouseEvent) => void;
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger className='w-full flex justify-between items-center text-red-500'>
				Delete
				<Trash2 size={16} className='text-red-500' />
			</AlertDialogTrigger>
			<AlertDialogContent onClick={(e) => e.stopPropagation()}>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Concept?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this learning path? This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						<Trash2 size={18} className='mr-1' />
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConceptCard;
