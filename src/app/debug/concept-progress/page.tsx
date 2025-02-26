'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateConceptProgress } from '@/app/chat/[id]/actions';

export default function ConceptProgressDebugPage() {
	const [conceptId, setConceptId] = useState('');
	const [userId, setUserId] = useState('');
	const [progress, setProgress] = useState(0);
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch user ID on page load
	useEffect(() => {
		const fetchUserId = async () => {
			try {
				const response = await fetch('/api/user');
				const data = await response.json();
				if (data.userId) {
					setUserId(data.userId);
				}
			} catch (error) {
				console.error('Error fetching user ID:', error);
			}
		};

		fetchUserId();
	}, []);

	const fetchConceptData = async () => {
		if (!conceptId) {
			setError('Please enter a concept ID');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/debug/concept-progress?conceptId=${conceptId}`
			);
			const data = await response.json();
			setResult(data);
		} catch (error) {
			console.error('Error fetching concept data:', error);
			setError('Failed to fetch concept data');
		} finally {
			setLoading(false);
		}
	};

	const updateProgress = async () => {
		if (!conceptId || !userId) {
			setError('Please enter both concept ID and user ID');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await updateConceptProgress({
				conceptId,
				userId,
				progress,
			});

			setResult(result);

			// Refresh concept data
			await fetchConceptData();
		} catch (error) {
			console.error('Error updating progress:', error);
			setError('Failed to update progress');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto py-8'>
			<h1 className='text-2xl font-bold mb-6'>
				Concept Progress Debug Tool
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
				<Card>
					<CardHeader>
						<CardTitle>Fetch Concept Data</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Concept ID
							</label>
							<Input
								value={conceptId}
								onChange={(e) => setConceptId(e.target.value)}
								placeholder='Enter concept ID'
							/>
						</div>
						<Button onClick={fetchConceptData} disabled={loading}>
							{loading ? 'Loading...' : 'Fetch Data'}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Update Progress</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<label className='block text-sm font-medium mb-1'>
								User ID
							</label>
							<Input
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								placeholder='Enter user ID'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Progress ({progress}%)
							</label>
							<Input
								type='range'
								min='0'
								max='100'
								value={progress}
								onChange={(e) =>
									setProgress(parseInt(e.target.value))
								}
							/>
						</div>
						<Button onClick={updateProgress} disabled={loading}>
							{loading ? 'Updating...' : 'Update Progress'}
						</Button>
					</CardContent>
				</Card>
			</div>

			{error && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
					{error}
				</div>
			)}

			{result && (
				<Card>
					<CardHeader>
						<CardTitle>Result</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className='bg-gray-100 p-4 rounded overflow-auto max-h-96'>
							{JSON.stringify(result, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
