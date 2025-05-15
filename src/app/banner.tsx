'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function cookieConsentGiven() {
	if (!localStorage.getItem('cookie_consent')) {
		return 'undecided';
	}
	return localStorage.getItem('cookie_consent');
}

export default function Banner() {
	const [consentGiven, setConsentGiven] = useState<string | null>('');
	const posthog = usePostHog();

	useEffect(() => {
		// We want this to only run once the client loads
		// or else it causes a hydration error
		setConsentGiven(cookieConsentGiven());
	}, []);

	useEffect(() => {
		if (consentGiven !== '') {
			posthog.set_config({
				persistence:
					consentGiven === 'yes' ? 'localStorage+cookie' : 'memory',
			});
		}
	}, [consentGiven, posthog]);

	const handleAcceptCookies = () => {
		localStorage.setItem('cookie_consent', 'yes');
		setConsentGiven('yes');
	};

	const handleDeclineCookies = () => {
		localStorage.setItem('cookie_consent', 'no');
		setConsentGiven('no');
	};

	return (
		<>
			{consentGiven === 'undecided' && (
				<Card className='fixed bottom-5 right-5 p-4 px-6 max-w-md'>
					<p className='text-sm text-center'>
						We use tracking cookies to understand how you use the
						product and help us improve it. Click Accept to keep
						things running smoothly!
					</p>
					<div className='flex items-center justify-center gap-2 my-2'>
						<Button type='button' onClick={handleAcceptCookies}>
							Accept
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={handleDeclineCookies}
						>
							Decline
						</Button>
					</div>
				</Card>
			)}
		</>
	);
}
