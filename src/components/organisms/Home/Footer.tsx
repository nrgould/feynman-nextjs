import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/atoms/GradientButton';
import {
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Shield,
	Lock,
	Mail,
} from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
	return (
		<footer className='bg-black text-white py-12 pb-32'>
			<div className='container mx-auto px-4'>
				{/* Trust badges section */}
				{/* <div className='mb-12 py-8 border-b border-gray-800'>
					<div className='flex flex-col items-center justify-center space-y-6'>
						<h3 className='text-2xl font-semibold text-center'>
							Trusted by Educators & Parents
						</h3>

						<div className='flex flex-wrap justify-center gap-8 items-center'>
							<div className='flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg'>
								<Shield className='h-5 w-5 text-emerald-400' />
								<span>COPPA Compliant</span>
							</div>
							<div className='flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg'>
								<Lock className='h-5 w-5 text-emerald-400' />
								<span>Data Privacy Focused</span>
							</div>
							<div className='flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg'>
								<Mail className='h-5 w-5 text-emerald-400' />
								<span>24/7 Support</span>
							</div>
						</div>

						<div className='flex flex-wrap justify-center gap-8 items-center mt-4'>
							{['school1', 'school2', 'school3', 'school4'].map(
								(school, i) => (
									<div
										key={i}
										className='w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center'
									>
										<span className='text-xs text-gray-400'>
											School {i + 1}
										</span>
									</div>
								)
							)}
						</div>
					</div>
				</div> */}

				{/* <div className='flex flex-col md:flex-row justify-between'> */}
				{/* Company Links */}
				{/* <div className='mb-8 md:mb-0'>
						<h4 className='text-xl font-semibold mb-4'>Company</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/about'
									className='hover:text-emerald-400 transition-colors'
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='hover:text-emerald-400 transition-colors'
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href='/careers'
									className='hover:text-emerald-400 transition-colors'
								>
									Careers
								</Link>
							</li>
						</ul>
					</div> */}

				{/* Resources */}
				{/* <div className='mb-8 md:mb-0'>
						<h4 className='text-xl font-semibold mb-4'>
							Resources
						</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/for-parents'
									className='hover:text-emerald-400 transition-colors'
								>
									For Parents
								</Link>
							</li>
							<li>
								<Link
									href='/for-students'
									className='hover:text-emerald-400 transition-colors'
								>
									For Students
								</Link>
							</li>
							<li>
								<Link
									href='/plans'
									className='hover:text-emerald-400 transition-colors'
								>
									Pricing
								</Link>
							</li>
						</ul>
					</div> */}

				{/* Legal */}
				{/* <div className='mb-8 md:mb-0'>
						<h4 className='text-xl font-semibold mb-4'>Legal</h4>
						<ul className='space-y-2'>
							<li>
								<Link
									href='/policies/privacy-policy'
									className='hover:text-emerald-400 transition-colors'
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/policies/terms-of-service'
									className='hover:text-emerald-400 transition-colors'
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href='/policies/cookie-policy'
									className='hover:text-emerald-400 transition-colors'
								>
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div> */}

				{/* Newsletter Signup */}
				{/* <div className='md:max-w-xs'>
						<h4 className='text-xl font-semibold mb-4'>
							Stay Updated
						</h4>
						<p className='text-gray-400 mb-4'>
							Subscribe to our newsletter for the latest updates,
							learning tips, and special offers.
						</p>
						<div className='flex gap-2'>
							<input
								type='email'
								placeholder='Your email'
								className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex-grow text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
							/>
							<Button className='bg-emerald-500 hover:bg-emerald-600'>
								Subscribe
							</Button>
						</div>
					</div>
				</div> */}

				{/* Divider */}
				{/* <div className='my-8 border-t border-gray-800'></div> */}

				{/* Social Media and Attribution */}
				<div className='flex flex-col md:flex-row items-center justify-between'>
					<div className='space-y-2 text-center md:text-left mb-4 md:mb-0'>
						<p>
							&copy; {new Date().getFullYear()} NRG Studios, LLC.
							All rights reserved.
						</p>
						<p className='text-sm text-gray-400'>
							Images Source:{' '}
							<Link
								href='https://popsy.co'
								target='_blank'
								rel='noopener noreferrer'
								className='hover:text-gray-300 underline'
							>
								popsy.co
							</Link>
						</p>
					</div>
					<div className='flex space-x-4'>
						<Link
							href='https://www.facebook.com/feynmanlearning'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-emerald-400 transition-colors'
						>
							<Facebook className='h-5 w-5' />
						</Link>
						{/* <Link
							href='https://threads.com/feynmanlearning'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-emerald-400 transition-colors'
						>
							<Twitter className='h-5 w-5' />
						</Link> */}
						<Link
							href='https://instagram.com/feynmanlearning'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-emerald-400 transition-colors'
						>
							<Instagram className='h-5 w-5' />
						</Link>
						{/* <Link
							href='https://linkedin.com'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-emerald-400 transition-colors'
						>
							<Linkedin className='h-5 w-5' />
						</Link> */}
					</div>
				</div>
			</div>
		</footer>
	);
}
