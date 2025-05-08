import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function parseMarkdownIntoBlocks(markdown: string): string[] {
	const safeMarkdown = markdown || '';
	const tokens = marked.lexer(safeMarkdown);
	return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
	({ content }: { content: string }) => {
		return (
			<ReactMarkdown
				remarkPlugins={[remarkMath]}
				rehypePlugins={[rehypeKatex]}
			>
				{content}
			</ReactMarkdown>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) return false;
		return true;
	}
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
	({ content, id }: { content: string; id: string }) => {
		const blocks = useMemo(
			() => parseMarkdownIntoBlocks(content),
			[content]
		);

		return blocks.map((block, index) => (
			<MemoizedMarkdownBlock
				content={block}
				key={`${id}-block_${index}`}
			/>
		));
	}
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';
