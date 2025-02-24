// app/PostHogPageView.jsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useAuth, useUser } from '@clerk/nextjs';

function PostHogPageView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();

	const { isSignedIn, userId } = useAuth();
	const { user } = useUser();

	// Track pageviews
	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url = url + '?' + searchParams.toString();
			}

			posthog.capture('$pageview', { $current_url: url });
		}
	}, [pathname, searchParams, posthog]);

	useEffect(() => {
		// 👉 Check the sign-in status and user info,
		//    and identify the user if they aren't already
		if (isSignedIn && userId && user && !posthog._isIdentified()) {
			// 👉 Identify the user
			posthog.identify(userId, {
				email: user.primaryEmailAddress?.emailAddress,
				username: user.username,
			});
		}

		// 👉 Reset the user if they sign out
		if (!isSignedIn && posthog._isIdentified()) {
			posthog.reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [posthog, user]);

	return null;
}

// Wrap this in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
export default function SuspendedPostHogPageView() {
	return (
		<Suspense fallback={null}>
			<PostHogPageView />
		</Suspense>
	);
}
