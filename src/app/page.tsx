import Title from '@/components/atoms/Title';
import Hero from '@/components/organisms/Home/Hero';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Shapes, FileUp } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/organisms/Home/Footer';
import AdaptiveLearning from '@/components/organisms/Home/AdaptiveLearning';

export default async function Home() {
	return (
		<div className='bg-background'>
			<Hero />
		</div>
	);
}
