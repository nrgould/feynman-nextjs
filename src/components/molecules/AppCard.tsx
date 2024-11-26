import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';

interface Props {
	title: string;
	subtitle: string;
	description: string;
	link?: string;
	linkTitle?: string;
}

export default function AppCard({
	title,
	description,
	subtitle,
	link,
	linkTitle,
}: Props) {
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
					<Button className='w-fit' onClick={() => console.log(link)}>
						{linkTitle}
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
