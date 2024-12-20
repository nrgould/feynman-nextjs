import { AlertCircle, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '../ui/button';

function AlertComponent({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<Alert variant='destructive'>
			<User className='h-6 w-6' />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}

export default AlertComponent;
