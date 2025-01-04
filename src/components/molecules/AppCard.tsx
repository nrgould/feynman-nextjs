import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppCardProps {
	title: string;
	subtitle: string;
	description: string;
	link?: string;
	linkTitle?: string;
	className?: string;
}

export default function AppCard({
	title,
	description,
	subtitle,
	link,
	linkTitle,
	className,	
}: AppCardProps) {
	return (
		<Card>
			<CardHeader>
				{title && <CardTitle>{title}</CardTitle>}
				{subtitle && <CardDescription>{subtitle}</CardDescription>}
			</CardHeader>
			{description && (
				<CardContent>
					<p>{description}</p>
				</CardContent>
			)}
			{link && (
				<CardFooter>
					<Link href={link}>
						<Button className='w-fit' variant='secondary'>
							{linkTitle}
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	);
}
