import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
	const cookieStore = await cookies();
	const { getToken } = await auth();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
			global: {
				fetch: async (url, options = {}) => {
					const clerkToken = await getToken({ template: 'supabase' });
					// @ts-expect-error options.headers is not typed
					const headers = new Headers(options!.headers);
					headers.set('Authorization', `Bearer ${clerkToken}`);
					return fetch(url, { ...options, headers });
				},
			},
		}
	);
}