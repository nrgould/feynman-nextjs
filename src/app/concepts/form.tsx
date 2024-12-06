'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useActionState } from 'react';
import { createMessageAction } from './actions';

function Form({ userId }: { userId: string }) {
	const [state, action] = useActionState(createMessageAction, {
		userId,
	});
	return (
		<form
			action={action}
			className='flex flex-row items-start justify-center'
		>
			<Input type='text' name='input' />
			<Button type='submit'>Submit</Button>
		</form>
	);
}

export default Form;
