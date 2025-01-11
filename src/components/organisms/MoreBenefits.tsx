import { Target, BookOpen, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FeaturesSection() {
	return (
		<section className='w-full py-12 md:py-24 lg:py-32 bg-slate-700'>
			<div className='container px-4 md:px-6 mx-auto w-1/2'>
				<Tabs defaultValue='growth' className='max-w-1/3'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger
							value='growth'
							className='flex items-center gap-2'
						>
							<Target className='h-4 w-4 text-emerald-500' />
							<span>Growth Mindset</span>
						</TabsTrigger>
						<TabsTrigger
							value='organization'
							className='flex items-center gap-2'
						>
							<BookOpen className='h-4 w-4 text-blue-500' />
							<span>Smart Organization</span>
						</TabsTrigger>
						<TabsTrigger
							value='inclusive'
							className='flex items-center gap-2'
						>
							<GraduationCap className='h-4 w-4 text-rose-500' />
							<span>Inclusive Learning</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value='growth' className='mt-6 px-6 max-w-xl'>
						<div className='space-y-4'>
							<h4 className='text-2xl font-bold text-white'>
								Break the &apos;Math Isn&apos;t for Me&apos;
								Mindset
							</h4>
							<p className='text-base text-muted-foreground font-mono text-white'>
								Math doesn&apos;t have to feel impossible. Our
								AI facilitates a growth mindset by tailoring
								concepts to your pace and preferences. With
								active recall and smart study techniques,
								you&apos;ll discover the math genius you
								didn&apos;t know you had.
							</p>
						</div>
					</TabsContent>

					<TabsContent
						value='organization'
						className='mt-6 px-6 max-w-xl'
					>
						<div className='space-y-4'>
							<h4 className='text-2xl font-bold text-white'>
								Simplify Learning, Amplify Results
							</h4>
							<p className='text-base text-muted-foreground font-mono text-white'>
								Say goodbye to confusing study guides and
								ineffective notes. Upload your PDFs, practice
								exams, or lecture slides, and let our AI extract
								key concepts and manage your learning path. Save
								time, reduce stress, and focus on
								understanding—not just memorizing.
							</p>
						</div>
					</TabsContent>

					<TabsContent
						value='inclusive'
						className='mt-6 px-6 max-w-xl'
					>
						<div className='space-y-4'>
							<h4 className='text-2xl font-bold text-white'>
								Built for Students Left Behind
							</h4>
							<p className='text-base text-muted-foreground font-mono text-white'>
								The school system isn&apos;t designed for
								everyone—but we are. Whether you&apos;ve been
								told you&apos;re bad at math or felt lost in
								class, our AI meets you where you are and helps
								you move forward, one concept at a time.
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
}
