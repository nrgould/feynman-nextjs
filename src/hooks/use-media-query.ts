'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design that detects if a media query matches
 * @param query The media query to check (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
	// Initialize with null and update after mount to avoid hydration mismatch
	const [matches, setMatches] = useState<boolean>(false);
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);

		// Create a media query list
		const mediaQuery = window.matchMedia(query);

		// Set the initial value
		setMatches(mediaQuery.matches);

		// Define a callback function to handle changes
		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Add the callback as a listener for changes to the media query
		mediaQuery.addEventListener('change', handleChange);

		// Clean up
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [query]);

	// Return false during SSR to avoid hydration mismatch
	if (!mounted) return false;

	return matches;
}
