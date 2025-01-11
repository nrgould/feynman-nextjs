'use client';

import React, { useEffect } from 'react';
import { Input } from '../ui/input';
import { useChat } from 'ai/react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { RotateCcw, Send, TestTube2 } from 'lucide-react';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { motion } from 'framer-motion';
import { Markdown } from '../atoms/Markdown';

const SUGGESTED_CONCEPTS = [
	{
		text: 'Limits',
	},
	{
		text: 'Factor by grouping',
	},
	{
		text: 'Simple Derivatives',
	},
] as const;

function HomeSampleChat() {
	const {
		messages,
		setMessages,
		input,
		setInput,
		handleInputChange,
		handleSubmit,
	} = useChat({
		api: '/api/sample-chat',
	});

	useEffect(() => {
		setMessages([
			{
				id: '1',
				role: 'assistant',
				content: `Hey there! Type a concept you want to test your knowledge on. Or choose one from below.`,
			},
		]);
	}, [setMessages]);
	return (
		<div className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-24 px-4'>
			<div className='flex-1 max-w-md space-y-6'>
				<TestTube2 className='w-12 h-12 text-emerald-400 mb-4' />
				<h2 className='text-4xl md:text-5xl font-bold tracking-tight'>
					Try it for yourself.
				</h2>
				<p className='text-xl font-medium text-zinc-500'>
					Experience how our AI tutor adapts to you through exploratory learning.
					Test your knowledge on any concept in mathematics and get
					immediate, personalized feedback.
				</p>
			</div>

			<div className='flex-1 w-full md:max-w-md'>
				<Card className='relative'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div className='flex flex-row items-center gap-2  mt-2'>
							<Avatar>
								<AvatarImage
									src='images/systemAvatar.png'
									alt='AI Assistant'
								/>
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
							<div className='flex flex-col items-start'>
								<Label className='font-semibold text-md'>
									AI Tutor
								</Label>
								<Label className='font-medium text-sm text-zinc-500'>
									Assessing weak points
								</Label>
							</div>
						</div>
						<Button
							variant='outline'
							size='icon'
							className='rounded-full'
							onClick={() => {
								setMessages([
									{
										id: '1',
										role: 'assistant',
										content: `Hey there! Pick a concept you want to test your knowledge on.`,
									},
								]);
							}}
						>
							<RotateCcw />
						</Button>
					</CardHeader>

					<CardContent className='space-y-4 h-[400px] overflow-y-auto pb-4'>
						<ScrollArea className='pb-4'>
							{messages.map((m) => (
								<div
									key={m.id}
									className='whitespace-pre-wrap grid grid-cols-3 w-full mb-1'
								>
									{m.role === 'assistant' ? (
										<div className='flex flex-col gap-1 p-2 px-3 rounded-xl col-span-2 bg-zinc-100 font-medium'>
											<Markdown>{m.content}</Markdown>
										</div>
									) : (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
											className='flex flex-col gap-1 p-2 px-4 rounded-xl col-start-2 col-span-2 justify-self-end bg-zinc-900 text-white'
										>
											<Markdown>{m.content}</Markdown>
										</motion.div>
									)}
								</div>
							))}
						</ScrollArea>
					</CardContent>

					<CardFooter className='h-[100px] pt-2'>
						<form
							onSubmit={handleSubmit}
							className='w-full flex items-center flex-col gap-3 '
						>
							{messages.length === 1 && (
								<div className='flex flex-wrap gap-2 w-full'>
									{SUGGESTED_CONCEPTS.map((concept) => (
										<motion.div
											key={concept.text}
											whileHover={{ y: -5 }}
										>
											<Button
												variant='secondary'
												size='sm'
												className='rounded-md font-medium'
												onClick={() => {
													setInput(concept.text);
													handleSubmit();
												}}
											>
												{concept.text}
											</Button>
										</motion.div>
									))}
								</div>
							)}
							<div className='flex flex-row gap-0.5 w-full'>
								<Input
									value={input}
									placeholder='Your answer...'
									onChange={handleInputChange}
									className='w-full mr-2 h-10 font-medium'
								/>
								<motion.div whileHover={{ y: -2, scale: 1.05 }}>
									<Button
										type='submit'
										size='icon'
										className='w-12 h-10'
									>
										<Send />
									</Button>
								</motion.div>
							</div>
						</form>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export default HomeSampleChat;
