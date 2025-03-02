import { Button } from "@/components/ui/button";

import TryConceptsGenerator from "@/app/try-concepts/TryConceptsGenerator";
import Link from "next/link";
import { FileUp } from "lucide-react";

export default function TryConcepts() {
	return (
		<section className='py-16 bg-gradient-to-b from-white to-gray-50 mt-24'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col md:flex-row items-center gap-12'>
					<div className='md:w-1/2 space-y-6'>
						<h2 className='text-3xl md:text-4xl font-bold'>
							Start with any{' '}
							<span className='text-emerald-500'>PDF</span>
						</h2>
						<p className='text-lg text-zinc-600'>
							Upload any PDF and see how our AI can extract key
							learning concepts and create a custom learning path.
						</p>
						<ul className='space-y-3'>
							{[
								'Extract key concepts from any document',
								'Generates a custom learning path',
								'Free to use',
							].map((item, i) => (
								<li key={i} className='flex items-center gap-2'>
									<div className='h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center'>
										<div className='h-2 w-2 rounded-full bg-emerald-500'></div>
									</div>
									<span>{item}</span>
								</li>
							))}
						</ul>
						<div className='pt-4'>
							<Link href='/try-concepts'>
								<Button
									size='lg'
									className='gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md'
								>
									<FileUp className='h-4 w-4' />
									Try Concept Generator
								</Button>
							</Link>
						</div>
					</div>
					<div className='md:w-1/2'>
						<TryConceptsGenerator />
					</div>
				</div>
			</div>
		</section>
	);
}
