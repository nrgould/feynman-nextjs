import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageBubble from './MessageBubble';

// Mock UserMessage and SystemMessage
jest.mock('../atoms/UserMessageBubble', () => {
	const UserMessageBubbleMock = ({ message }: { message: string }) => (
		<div data-testid='user-message'>{message}</div>
	);
	UserMessageBubbleMock.displayName = 'UserMessageBubbleMock';
	return UserMessageBubbleMock;
});

jest.mock('../atoms/SystemMessageBubble', () => {
	const SystemMessageBubbleMock = ({ message }: { message: string }) => (
		<div data-testid='system-message'>{message}</div>
	);
	SystemMessageBubbleMock.displayName = 'SystemMessageBubbleMock';
	return SystemMessageBubbleMock;
});

describe('MessageBubble Component', () => {
	it('renders UserMessage when type is "user"', () => {
		// Arrange
		const testMessage = 'Hello from the user!';
		const testType = 'user';

		// Act
		render(<MessageBubble message={testMessage} type={testType} />);

		// Assert
		const userMessage = screen.getByTestId('user-message');
		expect(userMessage).toBeInTheDocument();
		expect(userMessage).toHaveTextContent(testMessage);
		expect(screen.queryByTestId('system-message')).not.toBeInTheDocument();
	});

	it('renders SystemMessage when type is "system"', () => {
		// Arrange
		const testMessage = 'System says hi!';
		const testType = 'system';

		// Act
		render(<MessageBubble message={testMessage} type={testType} />);

		// Assert
		const systemMessage = screen.getByTestId('system-message');
		expect(systemMessage).toBeInTheDocument();
		expect(systemMessage).toHaveTextContent(testMessage);
		expect(screen.queryByTestId('user-message')).not.toBeInTheDocument();
	});
});
