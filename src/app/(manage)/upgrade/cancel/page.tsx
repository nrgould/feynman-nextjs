import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function UpgradeCancelPage() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Upgrade Canceled</CardTitle>
					<CardDescription>
						Your subscription upgrade has been canceled.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>
						You have not been charged, and your current plan remains
						active. If this was a mistake, you can try upgrading
						again.
					</p>
				</CardContent>
				<CardFooter>
					<Button asChild className='w-full'>
						<Link href='/'>Go to Dashboard</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
