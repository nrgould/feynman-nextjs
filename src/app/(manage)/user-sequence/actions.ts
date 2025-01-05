'use server';

import { SignupData } from '@/components/organisms/SignupSequence';
import { saveUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function saveUserSequence(formData: SignupData) {
	await saveUser(formData);

	redirect('/concepts');
}
