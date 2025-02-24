import Head from 'next/head';
import Input from './input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
						<Tabs defaultValue='assessment' className='space-y-6'>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='assessment'>
									Assessment
								</TabsTrigger>
								<TabsTrigger value='about'>
									About the Technique
								</TabsTrigger>
							</TabsList>
							<TabsContent value='assessment'>
								<Input />
							</TabsContent>
							<TabsContent value='about' className='space-y-6'>
								<div className='prose prose-zinc dark:prose-invert max-w-2xl mx-auto'>
									<h2 className='text-2xl font-semibold mb-4'>
										The Feynman Technique
									</h2>
									<p className='text-muted-foreground'>
										The Feynman Technique is a powerful
										learning method developed by Nobel
										Prize-winning physicist Richard Feynman,
										known for his ability to explain complex
										concepts in simple terms.
									</p>

									<h3 className='text-xl font-medium mt-6 mb-3'>
										How it Works
									</h3>
									<ol className='list-decimal list-inside space-y-3 text-muted-foreground'>
										<li>
											<strong>Choose a Concept:</strong>{' '}
											Select something you want to learn
											or understand better.
										</li>
										<li>
											<strong>Teach It:</strong> Explain
											it to someone else (or pretend to)
											as if you&apos;re teaching it to a
											beginner.
										</li>
										<li>
											<strong>Identify Gaps:</strong> Note
											where you get stuck or can&apos;t
											explain something clearly.
										</li>
										<li>
											<strong>
												Review and Simplify:
											</strong>{' '}
											Go back to the source material for
											areas you struggled with, and refine
											your explanation.
										</li>
									</ol>

									<h3 className='text-xl font-medium mt-6 mb-3'>
										Why It&apos;s Effective
									</h3>
									<ul className='list-disc list-inside space-y-3 text-muted-foreground'>
										<li>
											Reveals gaps in your understanding
										</li>
										<li>
											Forces active engagement with the
											material
										</li>
										<li>
											Improves retention through teaching
										</li>
										<li>
											Develops clear communication skills
										</li>
										<li>
											Prevents the illusion of knowledge
										</li>
									</ul>

									<div className='mt-6 p-4 bg-secondary/20 rounded-lg'>
										<p className='text-sm text-muted-foreground italic'>
											&ldquo;If you can&apos;t explain it
											simply, you don&apos;t understand it
											well enough.&rdquo;
											<br />— Attributed to Richard
											Feynman
										</p>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</ScrollArea>
		</>
	);
}
