import { createClient } from '@/utils/supabase/server';
import AddTaskForm from './AddTaskForm';

export default async function Home() {
	const supabase = await createClient();

	const { data, error } = await supabase.from('tasks').select();

	console.log(data);
	console.log('Error', error);

	return (
		<div className='p-8 space-y-4'>
			<h1>Playground</h1>
			<AddTaskForm />
			{data && data.map((task) => <div key={task.id}>{task.name}</div>)}
		</div>
	);
}
