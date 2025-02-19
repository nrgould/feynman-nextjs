// app/providers.jsx
'use client';
import SuspendedPostHogPageView from '@/lib/posthog/PostHogPageView';
import PostHogPageView from '@/lib/posthog/PostHogPageView';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { cookieConsentGiven } from './banner';

export function PostHogProvider({ children }) {
	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
			api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
			person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
			capture_pageview: false, // Disable automatic pageview capture, as we capture manually
			persistence:
				cookieConsentGiven() === 'yes'
					? 'localStorage+cookie'
					: 'memory',
		});
	}, []);

	return (
		<PHProvider client={posthog}>
			<SuspendedPostHogPageView />
			{children}
		</PHProvider>
	);
}
