import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { getSession } from '@auth0/nextjs-auth0';
import { getConversation } from '@/app/data-access/conversation';
import { getMessages } from '@/app/data-access/messages';

export default async function ChatWindow({
	params,
}: {
	params: { id: string };
}) {
	const session = await getSession();
	const { id: chatId } = await params;
	const conversation = await getConversation(chatId);
	const messages = await getMessages(chatId);
	const user = session?.user || {};

	console.log(messages);
	console.log(conversation);

	// const handleSubmit = async (e: FormEvent) => {
	// 	e.preventDefault();
	// 	if (!userInput.trim()) return;

	// 	if (!user?.sub) {
	// 		throw new Error('User ID is missing');
	// 	}

	// 	// Add user message to Zustand store
	// 	addMessage({
	// 		chatId: chatId,
	// 		userId: user.sub,
	// 		sender: 'user',
	// 		message: userInput,
	// 		created_at: new Date(),
	// 	});
	// 	setMsgLoading(true);
	// 	setUserInput('');

	// 	try {
	// 		const res = await axios.post<ApiResponse>('/api/chatgpt', {
	// 			userInput,
	// 			context: messages.slice(0, -1), //this should be replaced with summarized context from GPT3.5
	// 		});
	// 		// Add system message to Zustand store and mongodb
	// 		addMessage({
	// 			chatId: params.id,
	// 			userId: user.sub,
	// 			sender: 'system',
	// 			message: res.data.result,
	// 			created_at: new Date(),
	// 		});
	// 		scrollToBottom();
	// 	} catch (error) {
	// 		console.error('Error fetching response:', error);

	// 		toast({
	// 			variant: 'destructive',
	// 			title: 'Uh oh! Something went wrong.',
	// 			description: 'There was a problem with your request.',
	// 			action: (
	// 				<ToastAction altText='Try again'>Try again</ToastAction>
	// 			),
	// 		});
	// 	}
	// 	setMsgLoading(false);
	// };

	return (
		<div className='relative flex flex-col lg:items-center md:items-baseline sm:items-baseline justify-center lg:px-24 md:px-8 sm:px-2 xs:px-0 w-full'>
			{/* Messages Area / Chat Middle */}
			<div className='pb-12 md:w-full'>
				<ChatMessages messages={messages || []} />
				{/* <div style={{ marginBottom: 100 }} ref={messagesEndRef} /> */}
			</div>

			{/* Input area / Chat Bottom */}
			<div className='fixed bottom-0 left-0 w-full'>
				<ChatBar userId={user.sub} chatId={chatId} />
			</div>
		</div>
	);
}
