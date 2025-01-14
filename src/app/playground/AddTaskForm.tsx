'use client';

import React, { useState } from 'react';
import { addTask } from './actions';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function AddTaskForm() {
	const [taskName, setTaskName] = useState('');
	const router = useRouter();

	async function onSubmit() {
		await addTask(taskName);
		setTaskName('');
		router.refresh();
	}

	return (
		<form action={onSubmit} className='flex flex-row gap-2 max-w-sm'>
			<Input
				autoFocus
				type='text'
				name='name'
				placeholder='Enter new task'
				onChange={(e) => setTaskName(e.target.value)}
				value={taskName}
			/>
			<Button type='submit'>Add</Button>
		</form>
	);
}
export default AddTaskForm;
