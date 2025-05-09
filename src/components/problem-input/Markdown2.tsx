import React from 'react';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';

interface MarkdownProps {
	content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
	return (
		<ReactMarkdown rehypePlugins={[rehypeKatex, rehypeRaw]}>
			{content}
		</ReactMarkdown>
	);
};

export default Markdown;
