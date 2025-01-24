import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/atoms/GradientButton';

export default function Footer() {
	return (
		<footer className='bg-black text-white py-12 pb-32'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col md:flex-row justify-between'>
					{/* Company Links */}
					<div className='mb-8 md:mb-0'>
						<h4 className='text-xl font-semibold mb-4'>Company</h4>
						<ul className='space-y-2'>
							<li>
								<Link href='/about' className='hover:underline'>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='hover:underline'
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href='/careers'
									className='hover:underline'
								>
									Careers
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources */}
					<div className='mb-8 md:mb-0'>
						<h4 className='text-xl font-semibold mb-4'>
							Resources
						</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/for-parents'
									className='hover:underline'
								>
									For Parents
								</Link>
							</li>
							<li>
								<Link
									href='/for-students'
									className='hover:underline'
								>
									For Students
								</Link>
							</li>
							<li>
								<Link
									href='/pricing'
									className='hover:underline'
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link href='/faq' className='hover:underline'>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div className='mb-8 md:mb-0'>
						<h4 className='text-xl font-semibold mb-4'>Legal</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/privacy-policy'
									className='hover:underline'
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/terms-of-service'
									className='hover:underline'
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href='/cookie-policy'
									className='hover:underline'
								>
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* Follow Us */}
					<div>
						<h4 className='text-xl font-semibold mb-4'>
							Follow Us
						</h4>
						<ul className='flex space-x-4'>
							<li>
								<Link
									href='https://facebook.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-gray-400'
								>
									Facebook
								</Link>
							</li>
							<li>
								<Link
									href='https://twitter.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-gray-400'
								>
									Twitter
								</Link>
							</li>
							<li>
								<Link
									href='https://instagram.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-gray-400'
								>
									Instagram
								</Link>
							</li>
							<li>
								<Link
									href='https://linkedin.com'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:text-gray-400'
								>
									LinkedIn
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Divider */}
				<div className='my-8 border-t border-gray-700'></div>

				{/* Subscribe Section */}
				<div className='flex flex-col md:flex-row items-center justify-between'>
					<p className='text-center md:text-left mb-4 md:mb-0'>
						&copy; {new Date().getFullYear()} Feynman Learning. All
						rights reserved.
					</p>
					<div>
						<Button asChild variant='secondary' className='px-6 py-2'>
							<Link href='/subscribe'>Subscribe</Link>
						</Button>
					</div>
				</div>
			</div>
		</footer>
	);
}
