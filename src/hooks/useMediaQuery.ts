'use client'; // Ensure this runs client-side

import { useState, useEffect } from 'react';

/**
 * Custom hook to track whether a CSS media query matches.
 * @param query The media query string (e.g., '(min-width: 1024px)')
 * @returns `true` if the query matches, `false` otherwise.
 */
const useMediaQuery = (query: string): boolean => {
	// Initialize state based on the initial match (important for SSR compatibility)
	// We default to false server-side, and check client-side in useEffect.
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// Ensure this runs only on the client
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia(query);

			// Function to update state based on query match
			const updateMatches = () => {
				setMatches(mediaQuery.matches);
			};

			// Set the initial state correctly on the client
			updateMatches();

			// Listener for changes
			const listener = (event: MediaQueryListEvent) => {
				setMatches(event.matches);
			};

			// Add listener using the recommended method
			try {
				mediaQuery.addEventListener('change', listener);
			} catch (e) {
				// Fallback for older browsers
				mediaQuery.addListener(listener);
			}

			// Cleanup function to remove the listener
			return () => {
				try {
					mediaQuery.removeEventListener('change', listener);
				} catch (e) {
					// Fallback for older browsers
					mediaQuery.removeListener(listener);
				}
			};
		}
	}, [query]); // Re-run effect if the query string changes

	return matches;
};

export default useMediaQuery;
