import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createChatFromConcept } from './actions';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { Ellipsis, EllipsisIcon, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { removePointerEventsFromBody } from '@/lib/utils';
import { deleteConversationAction } from '../chat/actions';
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

const ConceptCard = ({
	concept,
	userId,
}: {
	concept: any;
	userId?: string;
}) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!userId) {
			redirect('/api/auth/login');
		}
		e.stopPropagation();
		createChatFromConcept(userId, concept.title, concept.description);
	};

	const handleDelete = async (e: React.MouseEvent) => {
		// try {
		// 	await deleteConversationAction(conversation._id);
		// 	removePointerEventsFromBody();
		// } catch (error) {
		// 	console.error('Error deleting conversation:', error);
		// }
	};

	return (
		<Card className='max-w-sm'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<CardTitle className='text-lg'>{concept.title}</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger className='p-1 rounded-md mr-2'>
							<Ellipsis size={18} color='gray' />
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56'>
							<DropdownMenuLabel>Options</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Create quiz</DropdownMenuItem>
							<DropdownMenuItem>Edit Details</DropdownMenuItem>
							<DropdownMenuItem>Reset progress</DropdownMenuItem>
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
			<CardContent className='gap-2'>
				<p className='line-clamp-2 text-sm text-muted-foreground'>
					{concept.description}
				</p>
				<div className='flex flex-col gap-2 max-w-[50%] mt-4'>
					<Label>Progress: {concept.progress * 100}%</Label>
					<Progress color='secondary' className='h-2' value={50} />
				</div>
			</CardContent>
			<CardFooter>
				<Button variant='outline' onClick={handleClick}>
					Start Learning
				</Button>
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
			<AlertDialogTrigger className='w-full flex justify-between items-center'>
				Delete chat
				<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
			</AlertDialogTrigger>
			<AlertDialogContent onClick={(e) => e.stopPropagation()}>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Conversation</AlertDialogTitle>
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
