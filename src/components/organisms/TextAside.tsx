import React from 'react';

function TextAside() {
	return (
		<section className='w-full  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-8 md:px-8'>
			<div className='max-w-6xl  mx-auto'>
				<div className='flex min-h-[20dvh] flex-col items-center justify-center md:flex-row gap-8'>
					<div className='md:w-1/2 lg:w-1/3 flex-1 max-w-sm'>
						<h2 className='text-3xl md:text-2xl mb-2 font-bold leading-tight text-gray-500'>
							Growth Mindset
						</h2>
						<h3 className='text-2xl md:text-5xl font-bold leading-tight text-gray-900'>
							Helping teens believe math is for them
						</h3>
					</div>

					<div className='md:w-1/2 lg:w-1/3 flex-1 max-w-sm'>
						<p className='text-lg text-gray-700 leading-relaxed font-medium'>
							&ldquo;I&rsquo;m just bad at math&rdquo; is a thing
							of the past. Whether your teen has felt unsupported
							in school or thinks math isn&rsquo;t their strength,
							our program meets them where they are, showing them
							that success is within reach.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default TextAside;
