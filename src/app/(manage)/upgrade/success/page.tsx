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

export default function UpgradeSuccessPage() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Upgrade Successful!</CardTitle>
					<CardDescription>
						Your subscription has been successfully upgraded.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>
						Thank you for upgrading! You now have access to all the
						premium features.
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
