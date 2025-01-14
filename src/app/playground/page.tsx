import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
	const supabase = await createClient();

	console.log(supabase);

	const { data, error } = await supabase.from('tasks').select();

	console.log(data);
	console.log('Error', error);

	return (
		<div>
			<h1>Playground</h1>
			{data && data.map((task) => <div key={task.id}>{task.name}</div>)}
		</div>
	);
}
