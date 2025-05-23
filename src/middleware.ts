import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
	'/',
	'/api/math-tutor',
	'/waitlist',
	'/sitemap.xml',
	'/api/(.*)',
	'/problems/:id',
]);

const isAuthRoute = createRouteMatcher(['/chat/:id', '/learning-path/:id']);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);

export default clerkMiddleware(async (auth, req) => {
	const { userId, sessionClaims, redirectToSignIn } = await auth();

	// For users visiting /onboarding, don't try to redirect
	if (userId && isOnboardingRoute(req)) {
		return NextResponse.next();
	}

	// Special handling for chat routes
	if (isAuthRoute(req)) {
		if (!userId) {
			// Store the chat URL to redirect back after sign in
			return redirectToSignIn({
				returnBackUrl: req.url,
			});
		}
		return NextResponse.next();
	}

	// If the user isn't signed in and the route is private, redirect to sign-in
	if (!userId && !isPublicRoute(req)) {
		return redirectToSignIn({ returnBackUrl: req.url });
	}

	// Catch users who do not have `onboardingComplete: true` in their publicMetadata
	if (userId && !sessionClaims?.metadata?.onboardingComplete) {
		const onboardingUrl = new URL('/onboarding', req.url);

		// Preserve query parameters, especially pdfId
		const url = new URL(req.url);
		if (url.searchParams.has('pdfId')) {
			onboardingUrl.searchParams.set(
				'pdfId',
				url.searchParams.get('pdfId')!
			);
		}

		return NextResponse.redirect(onboardingUrl);
	}

	// If the user is logged in and the route is protected, let them view
	if (userId && !isPublicRoute(req)) return NextResponse.next();

	// Allow public routes
	return NextResponse.next();
});

export const config = {
	// matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
