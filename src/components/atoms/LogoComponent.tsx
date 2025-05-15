import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function LogoComponent() {
	return (
		<Link href='/'>
			<div className='flex items-center justify-center gap-2'>
				<Image
					src='/images/felt-logo.png'
					alt='FEYNAMN LEARNING'
					width={40}
					height={40}
				/>
				<h1 className='text-md font-semibold text-center'>
					FEYNMAN LEARNING
				</h1>
			</div>
		</Link>
	);
}

export default LogoComponent;
