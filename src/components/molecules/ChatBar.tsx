import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Props {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	userInput: string;
	setUserInput: React.Dispatch<React.SetStateAction<string>>;
	loading: boolean;
}

const ChatBar = ({ handleSubmit, userInput, setUserInput, loading }: Props) => {
	return (
		<div>
			<div className='grow md:mr-5 xs:mr-4 self-end'>
				<form onSubmit={handleSubmit} className='relative flex'>
					<Input
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						placeholder='Type a message...'
						className='max-h-[5rem] pr-[3.125rem] resize-none mr-2'
					/>
					<Button
						type='submit'
						disabled={loading || !userInput.trim()}
					>
						{loading ? 'Sending...' : 'Send'}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ChatBar;
