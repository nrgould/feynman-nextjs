
import TryConceptsGenerator from '@/app/try-concepts/TryConceptsGenerator';
import { FileUp } from 'lucide-react';
import ColoredIcon from '@/components/atoms/ColoredIcon';
import * as motion from 'motion/react-client';

export default function TryConcepts() {
	return (
		<section className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-12 px-4 mx-auto'>
			<div className='flex-1 max-w-md space-y-6'>
				<ColoredIcon icon={FileUp} color='emerald' size='sm' />

				<h2 className='text-3xl md:text-4xl font-bold leading-loose tracking-tighter'>
					<span className='relative'>
						<span>Start with</span>
						<motion.span
							className='absolute -bottom-1 left-[8.6ch] h-[5px] bg-emerald-400'
							initial={{ width: 0 }}
							whileInView={{ width: '2.8ch' }}
							transition={{
								duration: 0.8,
								ease: 'easeOut',
								delay: 0.2,
							}}
						/>
					</span>{' '}
					any PDF
				</h2>

				<div className='space-y-4 text-gray-600 font-medium'>
					<motion.p
						initial={{ y: 10 }}
						whileInView={{ y: 0 }}
						transition={{
							duration: 0.5,
							ease: 'easeOut',
							delay: 0.2,
						}}
					>
						Upload any practice exams, lecture slides, homework, or
						any other document and see how our AI can extract key
						learning concepts and create a custom learning path.
					</motion.p>
					<ul className='space-y-3'>
						{[
							'Extract key concepts from any document',
							'Generates a custom learning path',
							'Free to use',
						].map((item, i) => (
							<motion.li
								key={i}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.5,
									delay: 0.3 + i * 0.1,
								}}
								className='flex items-center gap-2'
							>
								<div className='h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center'>
									<div className='h-2 w-2 rounded-full bg-emerald-500'></div>
								</div>
								<span>{item}</span>
							</motion.li>
						))}
					</ul>
				</div>

				{/* <Button
					size='lg'
					className='font-semibold w-auto gap-2'
					asChild
				>
					<Link href='/try-concepts'>
						<FileUp className='h-4 w-4' />
						Try Concept Generator
					</Link>
				</Button> */}
			</div>

			<div className='flex-1 relative max-w-lg'>
				<TryConceptsGenerator />
			</div>
		</section>
	);
}
