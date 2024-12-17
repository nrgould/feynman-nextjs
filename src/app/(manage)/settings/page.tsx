'use client';

import Subtitle from '@/components/atoms/Subtitle';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

import EmailPreferences from '@/components/molecules/EmailPreferences';
import EditProfileSheet from '@/components/molecules/EditProfileSheet';
import DeleteAccountDialog from '@/components/molecules/DeleteAccountDialog';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

const Settings = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();

	if (!isLoading && !user) {
		router.push('/api/auth/login');
		return null; // Return nothing while redirecting
	}
	// Handle save action
	const handleSave = () => {
		alert('Settings saved!');
		// Add logic to save settings (e.g., API call or local storage update)
	};

	return (
		<div className='w-full m-h-screen flex flex-col items-start justify-between p-4'>
			<Subtitle>Settings</Subtitle>

			{/* User Preferences */}
			<section className='w-full mb-10 flex-1 space-y-8'>
				<h3 className='text-xl'>User Preferences</h3>
				<div>
					<EmailPreferences />
				</div>
			</section>

			{/* Account Management */}
			<section className='mb-10 flex-1 space-y-4'>
				<h3 className='text-xl'>Account Management</h3>
				<EditProfileSheet />
				<DeleteAccountDialog />
			</section>

			{/* Save Button */}
			<Button variant='default' onClick={handleSave}>
				Save Settings
			</Button>
		</div>
	);
};

export default Settings;
