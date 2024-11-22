import { create } from 'zustand';

export type Message = {
	id: string; // Unique identifier for each message
	text: string; // The content of the message
	type: 'user' | 'system'; //Whether message is coming from the user or system
};

type MessageStore = {
	messages: Message[];
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updatedText: string) => void;
	clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
	messages: [
		{
			id: '1732248372604',
			type: 'user',
			text: 'test',
		},
		{
			id: '1732248373494',
			text: "It seems like there may have been a typo in your message. Could you please provide more context or clarify your question or statement? I'm here to help with any math-related topics you might have.",
			type: 'system',
		},
		{
			id: '1732300071959',
			type: 'user',
			text: 'explain a concept to me',
		},
		{
			id: '1732300073710',
			type: 'system',
			text: "Sure, I'd be happy to help! Is there a specific math concept you would like me to explain to you? Please let me know which topic you're interested in learning about.",
		},
		{
			id: '1732300086270',
			type: 'user',
			text: 'How about basic factoring in algebra',
		},
		{
			id: '1732300089351',
			type: 'system',
			text: "Sure, I'd be happy to explain the concept of basic factoring in algebra to you!\n\nIn algebra, factoring involves expressing a mathematical expression as a product of its factors. The idea is to break down an expression into simpler parts that can be multiplied together to give the original expression. \n\nLet's start with a simple example:\nIf we have the expression \\(x^2 + 5x + 6\\), to factor this expression, we need to find two numbers that multiply to 6 (the constant term) and add up to 5 (the coefficient of the middle term). In this case, the numbers are 2 and 3 because \\(2 \\times 3 = 6\\) and \\(2 + 3 = 5\\).\n\nSo, we can rewrite \\(x^2 + 5x + 6\\) as \\((x + 2)(x + 3)\\) after factoring it.\n\nNow, it's important to understand that factoring is essentially the reverse process of multiplication. We are looking for what we could have multiplied together to get the original expression.\n\nDoes that make sense to you?",
		},
		{
			id: '1732300129256',
			type: 'user',
			text: 'Yes. Could you try giving me another example? ',
		},
		{
			id: '1732300130011',
			type: 'system',
			text: "Of course! Let's consider the expression $2x^2 + 7x + 3$. How would you factor this expression?",
		},
		{
			id: '1732300523005',
			type: 'user',
			text: 'So the 2x^2 will become x*2x, the 7x will be 2x*3 + x*1 and the 3 is 3*1. So the factor is (2x+1)(x+3)',
		},
		{
			id: '1732300528362',
			type: 'system',
			text: "It seems like you were attempting to factor the expression \\(2x^2 + 7x + 3\\) into the form you mentioned as \\((2x + 1)(x + 3)\\). Let's go through your steps:\n\nYou correctly broke down the coefficients of the terms as \\(2x^2 = x \\cdot 2x\\) for the first term, \\(7x = 2x \\cdot 3 + 1 \\cdot x\\) for the middle term, and \\(3 = 3 \\cdot 1\\) for the constant term. However, your factors should have resulted in a different expression when multiplied back together.\n\nTo correctly factor the expression \\(2x^2 + 7x + 3\\), we need to find two numbers that multiply to \\(2 \\cdot 3 = 6\\) (coefficient of the first term multiplied by the constant term) and add up to 7 (coefficient of the middle term).\n\nThe pair of numbers that meet these conditions are 1 and 3. So, we can rewrite \\(2x^2 + 7x + 3\\) as \\((2x + 1)(x + 3)\\) after proper factoring.\n\nDo you see where the mistake might have been in your factorization attempt? Feel free to ask any questions for further clarification.",
		},
		{
			id: '1732300636288',
			type: 'user',
			text: 'What do you mean? my answer was correct?',
		},
		{
			id: '1732300640487',
			type: 'system',
			text: "You seem to have made a small mistake in how you factored the expression \\(2x^2 + 7x + 3\\). Let's go over it together:\n\nTo factor the expression \\(2x^2 + 7x + 3\\), we need to find two numbers that multiply to \\(2 \\times 3 = 6\\) (the product of the coefficient of \\(x^2\\) and the constant term) and add up to 7 (the coefficient of \\(x\\)).\n\nThe correct pair of numbers that satisfy these conditions is 1 and 3. Specifically, \\(2 \\times 1 = 2\\), \\(1 \\times 3 = 3\\), and \\(2 + 3 = 5\\), not 7.\n\nSo the correct factorization of \\(2x^2 + 7x + 3\\) should be \\((2x + 1)(x + 3)\\).\n\nDoes that clarify things for you? Feel free to ask if you have any further questions or if you'd like to try another example.",
		},
		{
			id: '1732300671418',
			type: 'user',
			text: 'That is the answer I gave',
		},
		{
			id: '1732300673974',
			type: 'system',
			text: "I apologize for the confusion, but there seems to have been a misunderstanding. Let's revisit the correct factorization of the expression \\(2x^2 + 7x + 3\\) and compare it with your initial response:\n\nYou initially suggested factoring it as \\((2x + 1)(x + 3)\\). However, to factor \\(2x^2 + 7x + 3\\) correctly, we need to find two numbers that multiply to \\(2 \\times 3 = 6\\) (the product of the leading coefficient and the constant term) and add up to 7 (the coefficient of the middle term).\n\nThe correct factorization for \\(2x^2 + 7x + 3\\) is \\((2x + 1)(x + 3)\\). Therefore, your original response was indeed correct. I appreciate your patience, and well done on your accurate factorization!\n\nIf you have any more questions or need further clarification on factoring or any other math concepts, feel free to ask.",
		},
	],
	addMessage: (message) =>
		set((state) => ({
			messages: [...state.messages, message],
		})),
	removeMessage: (id) =>
		set((state) => ({
			messages: state.messages.filter((message) => message.id !== id),
		})),
	updateMessage: (id, updatedText) =>
		set((state) => ({
			messages: state.messages.map((message) =>
				message.id === id ? { ...message, text: updatedText } : message
			),
		})),
	clearMessages: () => set({ messages: [] }),
}));
