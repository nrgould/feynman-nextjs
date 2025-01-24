import { LucideIcon } from 'lucide-react';
import React from 'react';

type ColorScheme = 'emerald' | 'violet' | 'sky' | 'blue';
type IconSize = 'sm' | 'md' | 'lg';

interface ColoredIconProps {
	icon: LucideIcon;
	color?: ColorScheme;
	size?: IconSize;
	className?: string;
}

const colorSchemes = {
	emerald: {
		background: 'from-emerald-400 to-emerald-500 border-emerald-500',
	},
	violet: {
		background: 'from-violet-400 to-violet-500 border-violet-500',
	},
	sky: {
		background: 'from-sky-400 to-sky-500 border-sky-500',
	},
	blue: {
		background: 'from-blue-400 to-blue-500 border-blue-500',
	},
} as const;

const iconSizes = {
	sm: {
		container: 'p-2',
		icon: 'w-5 h-5',
	},
	md: {
		container: 'p-3',
		icon: 'w-6 h-6',
	},
	lg: {
		container: 'p-4',
		icon: 'w-8 h-8',
	},
} as const;

function ColoredIcon({
	icon: Icon,
	color = 'emerald',
	size = 'md',
	className = '',
}: ColoredIconProps) {
	return (
		<div
			className={`inline-block bg-gradient-to-b from-50% border rounded-lg ${colorSchemes[color].background} ${iconSizes[size].container} ${className}`}
		>
			<Icon className={`${iconSizes[size].icon} text-white`} />
		</div>
	);
}

export default ColoredIcon;
