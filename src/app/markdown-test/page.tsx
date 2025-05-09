'use client';

import { Markdown } from '@/components/atoms/Markdown';
import Markdown2 from '@/components/problem-input/Markdown2';

const content =
	'Given a **formula** below' +
	'$$' +
	's = ut + \\frac{1}{2}at^{2}' +
	'$$' +
	'Calculate the value of $s$ when $u = 10\\frac{m}{s}$ and $a = 2\\frac{m}{s^{2}}$ at $t = 1s$;' +
	'$$' +
	'\\int e^{2x} \, dx' +
	'$$';

const content2 = `Differentiate $3x^2$, $5x$, and $-4$ individually using the power rule.`;
const content3 =
	'$' + `\\int e^{2x} \\, dx,\\quad u = 2x,\\quad du = 2dx` + '$';

const content4 = '$' + '\\int e^{u} \\cdot \\frac{1}{2} du' + '$';

export default function MarkdownTest() {
	return (
		<div className='w-full h-full flex flex-col items-center justify-center p-8'>
			<Markdown>{content4}</Markdown>
			<Markdown>{`The volume of a sphere is $V(10)=5\\times10$`}</Markdown>
		</div>
	);
}
