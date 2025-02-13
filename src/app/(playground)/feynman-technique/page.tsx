import Head from 'next/head';
import Input from './input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FeynmanTechniquePage() {
	return (
		<>
			<Head>
				<title>
					Feynman Learning Technique | Improve Your Understanding
				</title>
				<meta
					name='description'
					content='Master any concept using the Feynman Learning Technique. Get instant feedback on your explanations with AI-powered assessment of clarity, completeness, depth, and more.'
					key='desc'
				/>
				<meta
					name='keywords'
					content='Feynman Technique, learning method, concept explanation, teaching to learn, understanding assessment, educational tool, learning feedback, AI assessment, student learning, concept mastery'
				/>

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta
					property='og:title'
					content='Feynman Learning Technique | Improve Your Understanding'
				/>
				<meta
					property='og:description'
					content='Master any concept using the Feynman Learning Technique. Get instant feedback on your explanations with AI-powered assessment.'
				/>
				<meta property='og:locale' content='en_US' />

				{/* Twitter */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta
					name='twitter:title'
					content='Feynman Learning Technique | Improve Your Understanding'
				/>
				<meta
					name='twitter:description'
					content='Master any concept using the Feynman Learning Technique. Get instant feedback on your explanations.'
				/>
			</Head>

			<ScrollArea className='h-screen'>
				<div className='container mx-auto px-4 py-8 pb-48'>
					<div className='text-center space-y-2 mb-8'>
						<h1 className='text-4xl font-bold'>
							AI Feynman Technique
						</h1>
						<p className='text-xl text-muted-foreground'>
							See if you&apos;re prepared for your next exam
						</p>
					</div>
					<div className='max-w-3xl mx-auto'>
						<Input />
					</div>
				</div>
			</ScrollArea>
		</>
	);
}
