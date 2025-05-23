'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Markdown } from '@/components/atoms/Markdown';
import { Label } from '@/components/ui/label';

export interface Option {
	label: string;
	input?: string;
}

interface InteractiveStepOptionsProps {
	toolCallId: string;
	title: string;
	options: Option[];
	handleAddNewStep: (step: string) => void;
	addToolResult: (args: { toolCallId: string; result: string }) => void;
}

export default function InteractiveStepOptions({
	toolCallId,
	title,
	options,
	handleAddNewStep,
	addToolResult,
}: InteractiveStepOptionsProps) {
	const randomizedOptions = useMemo(() => {
		return [...options].sort(() => Math.random() - 0.5);
	}, [options]);

	return (
		<div className='flex-1 flex flex-col p-4 items-center justify-center'>
			<h3 className='text-md md:text-lg font-semibold text-center'>
				<Markdown>{title}</Markdown>
			</h3>
			<div className='flex-1 grid grid-cols-2 gap-2 w-full md:w-1/2'>
				{randomizedOptions.map((option, optionIndex) => {
					if (option.input) {
						return (
							<div
								key={`option-input-${optionIndex}`}
								className='flex flex-col gap-2'
							>
								<Dialog>
									<DialogTrigger asChild>
										<Button
											variant='outline'
											className='py-8 text-wrap px-4 min-h-[5.5rem] whitespace-normal leading-snug text-center px-2 py-4' // Original class from page.tsx
										>
											<Markdown>{option.label}</Markdown>
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												<Markdown>
													{option.label}
												</Markdown>
											</DialogTitle>
										</DialogHeader>
										<form
											className='p-4'
											onSubmit={(e) => {
												e.preventDefault();
												const formData = new FormData(
													e.currentTarget
												);
												const inputValue = formData.get(
													'calculation'
												) as string;
												const result = `${option.label} (User inputted: ${inputValue})`;
												handleAddNewStep(result);
												addToolResult({
													toolCallId,
													result,
												});
												// Optionally close dialog here if Dialog state is managed
											}}
										>
											<Label>
												<Markdown>
													{option.input}
												</Markdown>
											</Label>
											<Input
												type='text'
												name='calculation'
												placeholder='type here'
												inputMode='text'
											/>
											<Button
												type='submit'
												className='mt-4'
											>
												Submit
											</Button>
										</form>
									</DialogContent>
								</Dialog>
							</div>
						);
					} else {
						return (
							<Button
								size='lg'
								key={`option-${optionIndex}`}
								onClick={() => {
									handleAddNewStep(option.label);
									addToolResult({
										toolCallId,
										result: option.label,
									});
								}}
								variant='outline'
								className='flex-1 text-wrap min-h-[5.5rem] whitespace-normal leading-snug text-center px-2 py-4' // Original class from page.tsx
							>
								<Markdown>{option.label}</Markdown>
							</Button>
						);
					}
				})}
			</div>
		</div>
	);
}
