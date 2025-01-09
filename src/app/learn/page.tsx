import { ScrollArea } from '@/components/ui/scroll-area';
import { generateLearningPlan } from '../chat/[id]/actions';
import { exampleLessonPlan } from '@/lib/ai/learningPlanSchema';
export default async function Page() {
	// const learningPlan = await generateLearningPlan(
	// 	'Factoring in Algebra',
	// 	'Learn about factoring in algebra',
	// 	'Factoring is the process of breaking down expressions into their simplest building blocks.'
	// );

	console.log(exampleLessonPlan.phases);

	return (
		<ScrollArea className='h-[calc(100vh-4rem)] w-full'>
			<div className='container mx-auto py-6 px-8 space-y-4'>
				<h1 className='text-3xl font-bold mb-6'>Learning Plan</h1>
				<h2 className='text-2xl font-bold'>Phases</h2>
				{exampleLessonPlan.phases.map((phase) => (
					<div key={phase.phase}>
						<h3 className='text-lg font-bold'>{phase.phase}</h3>
						<p>{phase.description}</p>
						{phase.focusAreas && (
							<ul>
								{phase.focusAreas.map((focus) => (
									<li key={focus.focus}>{focus.focus}</li>
								))}
							</ul>
						)}
					</div>
				))}
				<h2 className='text-2xl font-bold'>Mastery Checkpoints</h2>
				{exampleLessonPlan.masteryCheckpoints.map((checkpoint) => (
					<div key={checkpoint.description}>
						<h3 className='text-lg font-bold'>
							{checkpoint.description}
						</h3>
						<p>{checkpoint.tasks.join(', ')}</p>
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
