import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Try Concept Generator | Feynman Learning',
	description:
		'Upload a PDF and see how our AI can generate learning concepts for you. No account required to try it out.',
};

export default function TryConceptsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
