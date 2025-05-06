'use client';

import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ConfirmationToolCall {
	toolName: 'askForConfirmationTool';
	args: {
		feedback: string;
		newProblemState: string;
		options: string[];
	};
}

interface ExtractFeedbackToolCall {
	toolName: 'extractFeedback';
	args: {
		feedback: string;
	};
}
export default function Home() {
	const [problemState, setProblemState] = useState(
		'Solve for x: 2x + 5 = 15'
	);
	const [problemTitle, setProblemTitle] = useState('Solve for x:');
	const [feedback, setFeedback] = useState('');
	const {
		messages,
		input,
		setInput,
		append,
		handleSubmit,
		handleInputChange,
		addToolResult,
	} = useChat({
		api: '/api/math-tutor',
		experimental_prepareRequestBody: (body) => {
			const response = { ...body, problemState };
			return response;
		},
		onToolCall: ({ toolCall }) => {
			console.log(toolCall.toolName);
			if (toolCall.toolName === 'askForConfirmationTool') {
				const confirmationToolCall = toolCall as ConfirmationToolCall;
				setProblemState(confirmationToolCall.args.newProblemState);

				toast.success(confirmationToolCall.args.feedback);
				toast('FEEDBACK');
			}

			if (toolCall.toolName === 'problemSolvedTool') {
				console.log('PROBLEM SOLVED');
			}

			if (toolCall.toolName === 'extractFeedback') {
				const extractFeedbackToolCall = toolCall as ExtractFeedbackToolCall;
				setFeedback(extractFeedbackToolCall.args.feedback);
			}
		},
	});

	function appendProblem() {
		append({
			role: 'user',
			content: problemState,
		});
	}

	return (
		<div className='flex flex-col min-h-screen bg-background p-4 gap-4'>
			{/* Top section for the Math Problem */}
			<div className='flex-1 min-h-[50vh] flex flex-col justify-center items-center border rounded-lg p-4'>
				<h2 className='text-xl font-semibold mb-4'>{problemTitle}</h2>
				<p className='text-3xl font-semibold text-center p-4'>
					{problemState}
				</p>
				{messages.length === 0 && (
					<Button variant='outline' onClick={appendProblem}>
						Solve for x
					</Button>
				)}
				<p className='text-sm text-center p-4'>{feedback}</p>
			</div>

			<div className='flex-1 max-h-[50vh] flex flex-col justify-center items-center border rounded-lg p-4'>
				{messages?.map((message) => (
					<div key={message.id}>
						{message.parts.map((part) => {
							switch (part.type) {
								case 'tool-invocation': {
									const callId =
										part.toolInvocation.toolCallId;

									switch (part.toolInvocation.toolName) {
										case 'askForConfirmationTool': {
											switch (part.toolInvocation.state) {
												case 'call':
													return (
														<div
															className='flex-1 h-1/2 flex flex-col p-4'
															key={callId}
														>
															<h2 className='text-xl font-semibold mb-4 text-center'>
																{
																	part
																		.toolInvocation
																		.args
																		.title
																}
															</h2>
															<div className='flex-1 grid grid-cols-2 gap-4'>
																{part.toolInvocation.args.options.map(
																	(
																		option
																	) => (
																		<Button
																			key={
																				option
																			}
																			onClick={() => {
																				addToolResult(
																					{
																						toolCallId:
																							callId,
																						result: option,
																					}
																				);
																			}}
																			variant='outline'
																			className='w-[10rem] h-[10rem] text-center whitespace-normal bg-background hover:bg-background/80 dark:bg-zinc-800 rounded-xl'
																		>
																			{
																				option
																			}
																		</Button>
																	)
																)}
															</div>
														</div>
													);
											}
										}
										// case 'problemSolvedTool': {
										// 	return (
										// 		<div key={callId}>
										// 			PROBLEM SOLVED
										// 			{
										// 				part.toolInvocation.args
										// 					.message
										// 			}
										// 		</div>
										// 	);
										// }
									}
								}
							}
						})}
						<br />
					</div>
				))}
			</div>
		</div>
	);
}
