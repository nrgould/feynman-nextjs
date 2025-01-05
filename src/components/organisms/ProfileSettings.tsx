'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { saveUserProfile } from '@/app/(manage)/settings/actions';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const educationLevels = [
	'Elementary School',
	'Middle School',
	'High School',
	'Undergraduate',
	'Graduate',
	'Professional',
	'Self-Learner',
];

const learningDisabilities = [
	'None',
	'Dyslexia',
	'ADHD/ADD',
	'Dyscalculia',
	'Dysgraphia',
	'Other',
	'Prefer not to say',
];

const subjects = [
	'math',
	'science',
	'history',
	'literature',
	'cs',
	'arts',
	'languages',
	'music',
];

interface ProfileSettingsProps {
	initialData?: {
		name?: string;
		email?: string;
		username?: string;
		educationLevel?: string;
		learningDisability?: string;
		goals?: string;
		selectedSubjects?: string[];
		profileImage?: string;
	};
}

export function ProfileSettings({ initialData }: ProfileSettingsProps) {
	const { user } = useUser();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const { toast } = useToast();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		username: '',
		educationLevel: '',
		learningDisability: '',
		goals: '',
		selectedSubjects: [] as string[],
		profileImage: '',
	});

	useEffect(() => {
		if (initialData) {
			setFormData((prev) => ({
				...prev,
				...initialData,
			}));
			if (initialData.profileImage) {
				setImagePreview(initialData.profileImage);
			}
		}
	}, [initialData]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const uploadImage = async (file: File) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'your_cloudinary_upload_preset');

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
			{
				method: 'POST',
				body: formData,
			}
		);

		const data = await response.json();
		return data.secure_url;
	};

	const handleInputChange = (field: string, value: string | string[]) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubjectToggle = (subject: string) => {
		setFormData((prev) => ({
			...prev,
			selectedSubjects: prev.selectedSubjects.includes(subject)
				? prev.selectedSubjects.filter((s) => s !== subject)
				: [...prev.selectedSubjects, subject],
		}));
	};

	const handleSave = async () => {
		if (!user?.sid) return;

		// let profileImageUrl = formData.profileImage;

		// if (imageFile) {
		// 	profileImageUrl = await uploadImage(imageFile);
		// }

		const result = await saveUserProfile({
			...formData,
			userId: user.sid as string,
			// profileImage: profileImageUrl,
		});

		if (result.success) {
			toast({
				title: 'Success 🎉',
				description: 'Profile updated successfully',
			});
		} else {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: 'Failed to update profile',
			});
		}
	};

	return (
		<div className='w-full space-y-6 mb-8'>
			<div className='space-y-4'>
				<h3 className='text-xl font-semibold'>Profile Information</h3>

				<div className='space-y-2'>
					<Label>Profile Image</Label>
					<div className='flex items-center gap-4'>
						<div className='relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200'>
							{imagePreview || formData.profileImage ? (
								<Image
									src={imagePreview || formData.profileImage}
									alt='Profile'
									fill
									className='object-cover'
								/>
							) : (
								<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
									<Upload className='w-8 h-8 text-gray-400' />
								</div>
							)}
						</div>
						<Input
							type='file'
							accept='image/*'
							onChange={handleImageChange}
							className='max-w-[200px]'
						/>
					</div>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='name'>Name</Label>
					<Input
						id='name'
						value={formData.name}
						onChange={(e) =>
							handleInputChange('name', e.target.value)
						}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						value={formData.email}
						onChange={(e) =>
							handleInputChange('email', e.target.value)
						}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='username'>Username</Label>
					<Input
						id='username'
						value={formData.username}
						onChange={(e) =>
							handleInputChange('username', e.target.value)
						}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='education'>Education Level</Label>
					<Select
						value={formData.educationLevel}
						onValueChange={(value) =>
							handleInputChange('educationLevel', value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select education level' />
						</SelectTrigger>
						<SelectContent>
							{educationLevels.map((level) => (
								<SelectItem key={level} value={level}>
									{level}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='disability'>Learning Differences</Label>
					<Select
						value={formData.learningDisability}
						onValueChange={(value) =>
							handleInputChange('learningDisability', value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select learning difference' />
						</SelectTrigger>
						<SelectContent>
							{learningDisabilities.map((disability) => (
								<SelectItem key={disability} value={disability}>
									{disability}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='goals'>Learning Goals</Label>
					<Input
						id='goals'
						value={formData.goals}
						onChange={(e) =>
							handleInputChange('goals', e.target.value)
						}
						placeholder='What are your learning goals?'
					/>
				</div>

				<div className='space-y-2'>
					<Label>Subjects</Label>
					<div className='grid grid-cols-2 gap-2'>
						{subjects.map((subject) => (
							<div
								key={subject}
								className={`p-2 border rounded cursor-pointer ${
									formData.selectedSubjects.includes(subject)
										? 'bg-primary text-primary-foreground'
										: 'bg-background'
								}`}
								onClick={() => handleSubjectToggle(subject)}
							>
								{subject.charAt(0).toUpperCase() +
									subject.slice(1)}
							</div>
						))}
					</div>
				</div>
			</div>

			<Button className='w-full' onClick={handleSave}>
				Save Settings
			</Button>
		</div>
	);
}
