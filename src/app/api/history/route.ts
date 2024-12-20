import { getChatsByUserId } from '@/lib/db/queries';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET() {
	const session = await getSession();

	if (!session || !session.user) {
		return Response.json('Unauthorized!', { status: 401 });
	}

	// biome-ignore lint: Forbidden non-null assertion.
	const chats = await getChatsByUserId({ id: session.user.sub! });
	return Response.json(chats);
}
