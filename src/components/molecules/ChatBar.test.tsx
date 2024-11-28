import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBar from './ChatBar'; // Adjust the path as needed

describe('ChatBar Component', () => {
	const mockHandleSubmit = jest.fn((event) => event.preventDefault());
	const mockSetUserInput = jest.fn();

	const renderChatBar = (
		userInput: string = '',
		loading: boolean = false
	) => {
		render(
			<ChatBar
				handleSubmit={mockHandleSubmit}
				userInput={userInput}
				setUserInput={mockSetUserInput}
				loading={loading}
			/>
		);
	};

	it('renders the Textarea and Submit Button', () => {
		renderChatBar();

		// Check for textarea
		const textarea = screen.getByPlaceholderText('Type a message...');
		expect(textarea).toBeInTheDocument();

		// Check for button
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toBeDisabled(); // Button should initially be disabled
	});

	it('enables the button when userInput is not empty', () => {
		renderChatBar('Hello, world!');

		const button = screen.getByRole('button');
		expect(button).not.toBeDisabled();
	});

	it('disables the button when loading is true', () => {
		renderChatBar('Hello, world!', true);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled(); // Button should be disabled when loading
	});

	it('calls setUserInput on typing in the textarea', () => {
		renderChatBar();

		const textarea = screen.getByPlaceholderText('Type a message...');
		fireEvent.change(textarea, { target: { value: 'Test message' } });

		expect(mockSetUserInput).toHaveBeenCalledTimes(1);
		expect(mockSetUserInput).toHaveBeenCalledWith('Test message');
	});

	// it('calls handleSubmit when the form is submitted', () => {
	// 	renderChatBar('Hello, world!');

	// 	const form = screen.getByRole('form');
	// 	fireEvent.submit(form);

	// 	expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
	// });

	// it('does not call handleSubmit if userInput is empty', () => {
	// 	renderChatBar();

	// 	const form = screen.getByRole('form');
	// 	fireEvent.submit(form);

	// 	expect(mockHandleSubmit).not.toHaveBeenCalled();
	// });
});
