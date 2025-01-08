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
import {
	Ellipsis,
	Bolt,
	Trash2,
	Plus,
	Pencil,
	RotateCcw,
	Waypoints,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { removePointerEventsFromBody } from '@/lib/utils';
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

	const progress = concept.progress * 100 || 0;

	return (
		<Card className='w-full max-w-full md:max-w-sm'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<CardTitle className='text-lg flex items-center'>
						<Waypoints size={20} className='mr-2' />
						{concept.title}
					</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger className='p-1 rounded-md mr-2'>
							<Ellipsis size={18} color='gray' />
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56 font-medium'>
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
			</CardContent>
			<CardFooter className='flex justify-between items-end flex-1'>
				<div className='flex flex-col gap-2 w-1/3 mr-2'>
					<Label>{progress}%</Label>
					<Progress
						color='secondary'
						className='h-2'
						value={progress}
					/>
				</div>
				<Button
					variant={progress > 0 ? 'secondary' : 'outline'}
					onClick={handleClick}
					className='w-1/3'
				>
					{progress > 0 ? 'Continue' : 'Start'}
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
				Delete concept
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
