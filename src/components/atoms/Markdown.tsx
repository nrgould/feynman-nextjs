/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Components } from 'react-markdown';

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
	const processedContent = children
		.replace(/\\\(/g, '$')
		.replace(/\\\)/g, '$')
		.replace(/\[\[(.*?)\]\]/g, '$$$$1$$') // Double brackets for block math
		.replace(/\[(.*?)\]/g, '$$$$1$$'); // Single brackets as block math

	const components: Components = {
		code: ({ node, inline, className, children, ...props }: any) => {
			const match = /language-(\w+)/.exec(className || '');
			return !inline && match ? (
				<pre
					{...props}
					className={`${className} color-white text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}
				>
					<code className={match[1]}>{children}</code>
				</pre>
			) : (
				<code
					className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
					{...props}
				>
					{children}
				</code>
			);
		},
		ol: ({ node, children, ...props }: any) => {
			return (
				<ol className='list-decimal list-inside ml-4' {...props}>
					{children}
				</ol>
			);
		},
		li: ({ node, children, ...props }: any) => {
			return (
				<li className='py-1' {...props}>
					{children}
				</li>
			);
		},
		ul: ({ node, children, ...props }: any) => {
			return (
				<ul className='list-decimal list-inside ml-4' {...props}>
					{children}
				</ul>
			);
		},
		strong: ({ node, children, ...props }: any) => {
			return (
				<span className='font-semibold' {...props}>
					{children}
				</span>
			);
		},
		a: ({ node, children, href, ...props }: any) => {
			return (
				<a
					href={href}
					className='font-semibold text-blue-500 bg-slate-100 px-2 py-1 rounded'
					{...props}
				>
					{children}
				</a>
			);
		},
	};

	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex, rehypeRaw]}
			components={components}
		>
			{processedContent}
		</ReactMarkdown>
	);
};

export const Markdown = React.memo(
	NonMemoizedMarkdown,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);
