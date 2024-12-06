import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { createConversationAction } from '@/app/chat/actions';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

const CreateConversationButton = ({ userId }: { userId: string }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className='fixed bottom-6 right-6'>
						<form action={createConversationAction}>
							<input type='hidden' name='userId' value={userId} />
							<Button type='submit' variant='default' size='icon'>
								<Plus />
							</Button>
						</form>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>Create new conversation with AI</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CreateConversationButton;
