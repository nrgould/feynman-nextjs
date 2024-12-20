'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { Weather } from './Weather';
import { Stock } from './Stock';
import { Markdown } from '@/components/atoms/Markdown';
import { LearningStage } from './LearningStage';

export default function Page() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/test',
	});

	return (
		<div className='flex flex-col w-3/4 p-4 mx-auto items-center justify-between'>
			<div className='flex flex-col gap-2'>
				{messages.map((message) => (
					<div key={message.id}>
						{message.role === 'user' ? 'User: ' : 'AI: '}
						<Markdown>{message.content}</Markdown>
						<div>
							{message.toolInvocations?.map((toolInvocation) => {
								const { toolName, toolCallId, state } =
									toolInvocation;

								if (state === 'result') {
									if (toolName === 'displayWeather') {
										const { result } = toolInvocation;
										return (
											<div key={toolCallId}>
												<Weather {...result} />
											</div>
										);
									} else if (toolName === 'getLearningStage') {
										const { result } = toolInvocation;
										return (
											<LearningStage
												key={toolCallId}
												{...result}
											/>
										);
									}
								} else {
									return (
										<div key={toolCallId}>
											{toolName === 'displayWeather' ? (
												<div>Loading weather...</div>
											) : toolName === 'getStockPrice' ? (
												<div>
													Loading stock price...
												</div>
											) : (
												<div>Loading...</div>
											)}
										</div>
									);
								}
							})}
						</div>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit} className='flex w-full gap-2'>
				<Input
					value={input}
					onChange={handleInputChange}
					placeholder='Type a message...'
				/>
				<Button type='submit'>Send</Button>
			</form>
		</div>
	);
}
