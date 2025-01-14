import React from 'react';

function ColorSpan({ children }: { children: React.ReactNode }) {
	return (
		<span className='bg-gradient-to-b from-emerald-400 from-50% to-emerald-500 bg-clip-text text-transparent'>
			{children}
		</span>
	);
}

export default ColorSpan;
