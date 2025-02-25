import Head from 'next/head';
import Input from './input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSubConcepts } from './actions';
import { PreviousConcepts } from './PreviousConcepts';
import { MobilePreviousConcepts } from './MobilePreviousConcepts';

export default function FeynmanTechniquePage() {
	return (
		<>
			<Head>
				<title>
					Feynman Learning Technique | Improve Your Understanding of
					Any Concept
				</title>
				<meta
					name='description'
					content='Master any concept using the Feynman Learning Technique. Get instant feedback on your explanations with 
							 AI-powered assessment of clarity, completeness, depth, and more.'
					key='desc'
				/>
				<meta
					name='keywords'
					content='Feynman Technique, learning method, concept explanation, teaching to learn, understanding assessment, 
							 educational tool, learning feedback, AI assessment, student learning, concept mastery'
				/>

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta
					property='og:title'
					content='Feynman Learning Technique | Improve Your Understanding'
				/>
				<meta
					property='og:description'
					content='Master any concept using the Feynman Learning Technique. Get instant feedback on your explanations with 
							 AI-powered assessment.'
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
			<div className='flex flex-col md:flex-row min-h-screen'>
				{/* Previous concepts sidebar - hidden on mobile */}
				<div className='hidden md:block border-r'>
					<PreviousConcepts />
				</div>

				{/* Mobile previous concepts - visible only on mobile */}
				<div className='block md:hidden'>
					<MobilePreviousConcepts />
				</div>

				{/* Main content area */}
				<div className='flex-1'>
					<Input />
				</div>
			</div>
		</>
	);
}
