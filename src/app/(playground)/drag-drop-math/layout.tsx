import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Drag & Drop Math | Feynman Learning',
	description: 'Connect steps of math solutions in the correct order',
};

export default function DragDropMathLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='drag-drop-math-layout'>{children}</div>;
}
