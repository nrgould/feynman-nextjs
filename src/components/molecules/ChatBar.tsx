import React from 'react';
// import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Props {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	userInput: string;
	setUserInput: React.Dispatch<React.SetStateAction<string>>;
	loading: boolean;
}

const ChatBar = ({ handleSubmit, userInput, setUserInput, loading }: Props) => {
	return (
		<div className='p-4 px-24 md:mr-5 xs:mr-4 self-end bg-white'>
			<form onSubmit={handleSubmit} className='relative flex'>
				{/* <Input id='file' className='max-w-16' type='file' aria-label='file' /> */}
				<Textarea
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					placeholder='Type a message...'
					className='max-h-[5rem] pr-[3.125rem] resize-none mr-2'
				/>
				<Button type='submit' disabled={loading || !userInput.trim()}>
					{loading ? 'Sending...' : 'Send'}
				</Button>
			</form>
		</div>
	);
};

export default ChatBar;
