'use client';

import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoadingOverlayProps {
	isLoading: boolean;
	message?: string;
}

const LoadingOverlay = ({
	isLoading,
	message = 'Loading...',
}: LoadingOverlayProps) => {
	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className='flex flex-col items-center gap-4 p-6 rounded-lg bg-card shadow-lg border'>
						<Loader2 className='h-12 w-12 animate-spin text-primary' />
						<p className='text-lg font-medium text-center'>
							{message}
						</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default LoadingOverlay;
