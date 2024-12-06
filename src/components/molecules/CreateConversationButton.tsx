import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { createConversationAction } from '@/app/chat/actions';

const CreateConversationButton = ({ userId }: { userId: string }) => {
	return (
		<div className='absolute bottom-6 right-6'>
			<form action={createConversationAction}>
				<input type='hidden' name='userId' value={userId} />
				<Button type='submit'>
					<Plus />
				</Button>
			</form>
		</div>
	);
};

export default CreateConversationButton;
