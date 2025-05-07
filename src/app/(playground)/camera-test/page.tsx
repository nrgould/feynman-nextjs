// pages/camera.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Camera } from 'react-camera-pro';
import React, { useRef, useState } from 'react';

export default function CameraPage() {
	const cameraRef = useRef<any>(null);
	const [photo, setPhoto] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className='relative w-screen h-screen bg-black overflow-hidden'>
			{error && <p className='text-red-500'>Error: {error}</p>}
			{!photo && (
				<Camera
					ref={cameraRef}
					aspectRatio="cover"
					numberOfCamerasCallback={() => {}}
					idealFacingMode="environment"
					isImageMirror={false}
					errorMessages={{
						noCameraAccessible: 'No camera detected.',
						permissionDenied: 'Permission denied.',
						switchCamera: 'Switch camera',
						canvas: 'Canvas is not supported.',
					}}
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>
			)}
			{!photo && (
				<button
					onClick={() => {
						if (cameraRef.current) {
							try {
								const imageSrc = cameraRef.current.takePhoto();
								setPhoto(imageSrc);
							} catch (e) {
								setError('Failed to capture photo.');
							}
						}
					}}
					className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg"
				/>
			)}
			{photo && (
				<img
					src={photo}
					alt='Captured photo'
					className='absolute top-0 left-0 w-full h-full object-contain'
				/>
			)}
			{photo && (
				<Button
					onClick={() => {
						setPhoto(null);
					}}
					className='absolute bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white shadow-lg font-semibold'
				>
					RETAKE
				</Button>
			)}
		</div>
	);
}
