import { useEffect, useState } from 'react';

export const useWindowDimensions = () => {
	const [width, setWidth] = useState(
		typeof window !== 'undefined' ? window.innerWidth : 0
	);
	const [height, setHeight] = useState(
		typeof window !== 'undefined' ? window.innerHeight : 0
	);

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		// Set initial dimensions
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return [width, height];
};
