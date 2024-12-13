'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation, Message } from './actions';

export const maxDuration = 30;

function Learn() {
	const [conversation, setConversation] = useState<Message[]>([]);
	const [input, setInput] = useState<string>('');

	return (
		<div>
			<div>
				{conversation.map((message, index) => (
					<div key={index}>
						{message.role}: {message.content}
					</div>
				))}
			</div>

			<div className='flex gap-2'>
				<Input
					type='text'
					value={input}
					onChange={(event) => {
						setInput(event.target.value);
					}}
				/>
				<Button
					onClick={async () => {
						const { messages, newMessage } =
							await continueConversation([
								...conversation,
								{ role: 'user', content: input },
							]);

						setInput('');
						setConversation(messages);

						let textContent = '';

						for await (const delta of readStreamableValue(
							newMessage
						)) {
							textContent = `${textContent}${delta}`;

							setConversation([
								...messages,
								{ role: 'assistant', content: textContent },
							]);
						}
					}}
				>
					Send Message
				</Button>
			</div>
		</div>
	);
}

export default Learn;
