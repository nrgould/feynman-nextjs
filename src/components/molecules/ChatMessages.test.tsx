/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessages from './ChatMessages'; 
import { Message } from '@/store/store';

jest.mock('./MessageBubble', () => {
	return ({ message, type }: { message: string; type: string }) => (
		<div data-testid='message-bubble'>
			<span>{message}</span>
			<span>{type}</span>
		</div>
	);
});

jest.mock('../ui/skeleton', () => {
	return ({ className }: { className: string }) => (
		<div data-testid='skeleton' className={className}></div>
	);
});

describe('ChatMessages Component', () => {
	const mockMessages: Message[] = [
		{ text: 'Hello!', type: 'user', id: '1' },
		{ text: 'Hi there!', type: 'system', id: '2' },
	];

	it('renders the correct number of MessageBubble components', () => {
		render(<ChatMessages messages={mockMessages} loading={false} />);

		// Check that the correct number of MessageBubble components are rendered
		const messageBubbles = screen.getAllByTestId('message-bubble');
		expect(messageBubbles).toHaveLength(mockMessages.length);

		// Check that the content of each message is correct
		mockMessages.forEach((msg, index) => {
			expect(screen.getByText(msg.text)).toBeInTheDocument();
			expect(screen.getByText(msg.type)).toBeInTheDocument();
		});
	});

	// it('renders the Skeleton loader when loading is true', () => {
	// 	render(<ChatMessages messages={mockMessages} loading={true} />);

	// 	// Check that the Skeleton loader is rendered
	// 	const skeleton = screen.getByTestId('skeleton');
	// 	expect(skeleton).toBeInTheDocument();
	// });

	it('does not render the Skeleton loader when loading is false', () => {
		render(<ChatMessages messages={mockMessages} loading={false} />);

		// Check that the Skeleton loader is not rendered
		expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
	});
});
