'use server';

import { SignupData } from '@/components/organisms/SignupSequence';
import { createUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function saveUserSequence(formData: SignupData) {
	await createUser(formData);

	redirect('/concepts');
}
