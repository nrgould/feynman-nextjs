'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Lightbulb,
	BookOpen,
	PenTool,
	CheckCircle2,
	Brain,
	ArrowRight,
} from 'lucide-react';

interface FeynmanGuideSidebarProps {
	isInMobileView?: boolean;
	onClose?: () => void;
}

export function FeynmanGuideSidebar({
	isInMobileView = false,
	onClose,
}: FeynmanGuideSidebarProps) {
	return (
		<div className={isInMobileView ? 'h-full' : 'h-[calc(100vh-57px)]'}>
			<ScrollArea className='h-full'>
				<div className='p-4 space-y-6 mb-48'>
					<div className='p-4 border-l-4 border-primary bg-primary/5'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<Lightbulb className='w-5 h-5 mr-2 text-primary' />
							What is the Feynman Technique?
						</h2>
						<p className='text-sm text-zinc-600 mb-3'>
							The Feynman Technique is a powerful learning method
							developed by Nobel Prize-winning physicist Richard
							Feynman. It helps you understand concepts deeply by
							explaining them in simple terms.
						</p>
						<p className='text-sm text-zinc-600'>
							If you can&apos;t explain something simply, you
							don&apos;t understand it well enough.
						</p>
					</div>

					<div className='p-4 border-l-4 border-emerald-400 bg-emerald-50'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<BookOpen className='w-5 h-5 mr-2 text-emerald-500' />
							How to Use This Tool
						</h2>
						<ol className='list-decimal pl-5 space-y-4 text-zinc-600 text-sm'>
							<li>
								<div className='font-medium text-emerald-600 mb-1'>
									Choose a concept
								</div>
								<div>
									Enter any concept you want to understand
									better.
								</div>
							</li>
							<li>
								<div className='font-medium text-emerald-600 mb-1'>
									Select your grade level
								</div>
								<div>
									This helps tailor the assessment to your
									educational background.
								</div>
							</li>
							<li>
								<div className='font-medium text-emerald-600 mb-1'>
									Explain subconcepts
								</div>
								<div>
									Break down the main concept into smaller
									parts and explain each one in your own
									words.
								</div>
							</li>
							<li>
								<div className='font-medium text-emerald-600 mb-1'>
									Review and submit
								</div>
								<div>
									Review your complete explanation and submit
									it for assessment.
								</div>
							</li>
							<li>
								<div className='font-medium text-emerald-600 mb-1'>
									Get feedback
								</div>
								<div>
									Receive detailed feedback on your
									understanding, including strengths and areas
									for improvement.
								</div>
							</li>
						</ol>
					</div>

					<div className='p-4 border-l-4 border-amber-400 bg-amber-50'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<PenTool className='w-5 h-5 mr-2 text-amber-500' />
							Tips for Better Explanations
						</h2>
						<ul className='list-disc pl-5 space-y-2 text-zinc-600 text-sm'>
							<li>
								<span className='font-medium text-amber-600'>
									Use simple language:
								</span>{' '}
								Avoid jargon and technical terms unless you
								define them.
							</li>
							<li>
								<span className='font-medium text-amber-600'>
									Use analogies:
								</span>{' '}
								Compare complex ideas to familiar concepts.
							</li>
							<li>
								<span className='font-medium text-amber-600'>
									Be thorough:
								</span>{' '}
								Cover all important aspects of the concept.
							</li>
							<li>
								<span className='font-medium text-amber-600'>
									Identify gaps:
								</span>{' '}
								Note areas where your understanding is
								incomplete.
							</li>
							<li>
								<span className='font-medium text-amber-600'>
									Revise and refine:
								</span>{' '}
								Use the feedback to improve your understanding.
							</li>
						</ul>
					</div>

					<div className='p-4 border-l-4 border-violet-400 bg-violet-50'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<Brain className='w-5 h-5 mr-2 text-violet-500' />
							Assessment Metrics
						</h2>
						<ul className='list-disc pl-5 space-y-2 text-zinc-600 text-sm'>
							<li>
								<span className='font-medium text-violet-600'>
									Clarity:
								</span>{' '}
								How clearly you communicate your ideas.
							</li>
							<li>
								<span className='font-medium text-violet-600'>
									Completeness:
								</span>{' '}
								Whether you cover all key aspects of the
								concept.
							</li>
							<li>
								<span className='font-medium text-violet-600'>
									Depth:
								</span>{' '}
								How deeply you understand fundamental
								principles.
							</li>
							<li>
								<span className='font-medium text-violet-600'>
									Creativity:
								</span>{' '}
								Your use of analogies, examples, and novel
								approaches.
							</li>
							<li>
								<span className='font-medium text-violet-600'>
									Correctness:
								</span>{' '}
								The factual accuracy of your explanation.
							</li>
							<li>
								<span className='font-medium text-violet-600'>
									Language:
								</span>{' '}
								The quality of your writing and expression.
							</li>
						</ul>
					</div>

					<div className='p-4 border-l-4 border-sky-400 bg-sky-50'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<CheckCircle2 className='w-5 h-5 mr-2 text-sky-500' />
							Benefits of the Feynman Technique
						</h2>
						<ul className='list-disc pl-5 space-y-2 text-zinc-600 text-sm'>
							<li>Identifies gaps in your understanding</li>
							<li>Simplifies complex information</li>
							<li>Improves long-term retention</li>
							<li>Enhances your ability to communicate ideas</li>
							<li>Builds confidence in your knowledge</li>
						</ul>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
