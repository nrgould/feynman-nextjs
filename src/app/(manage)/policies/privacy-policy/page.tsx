import React from 'react';

export default function PrivacyPolicy() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<h1 className='text-3xl font-bold mb-8'>Privacy Policy</h1>
			<p className='text-gray-600 mb-4'>Effective Date: March 19, 2024</p>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>1. Introduction</h2>
				<p className='mb-4'>
					Welcome to Feynman Learning (the &quot;Service&quot;). We
					are committed to protecting your privacy and ensuring a safe
					online experience. This Privacy Policy explains how we
					collect, use, disclose, and safeguard your information when
					you use our AI adaptive learning platform.
				</p>
			</section>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>
					2. Information We Collect
				</h2>
				<ul className='list-disc pl-6 space-y-2'>
					<li>
						<strong>Personal Information:</strong> When you register
						or interact with our Service, we may collect information
						such as your name, email address, and other contact
						details.
					</li>
					<li>
						<strong>Usage Data:</strong> We automatically gather
						details on how you interact with our platform to enhance
						your learning experience.
					</li>
					<li>
						<strong>Learning Data:</strong> Your interactions with
						the adaptive learning modules help tailor the learning
						experience to your needs.
					</li>
					<li>
						<strong>Technical Data:</strong> We collect device
						information, IP addresses, browser type, and operating
						system details for analytics and troubleshooting.
					</li>
				</ul>
			</section>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>
					3. How We Use Your Information
				</h2>
				<ul className='list-disc pl-6 space-y-2'>
					<li>To personalize and improve your learning experience</li>
					<li>To analyze usage patterns and improve our features</li>
					<li>To communicate important updates and notifications</li>
					<li>
						To comply with legal obligations and enforce our
						agreements
					</li>
				</ul>
			</section>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>
					4. Data Security
				</h2>
				<p className='mb-4'>
					We implement appropriate technical and organizational
					measures to protect your personal information. However, no
					method of transmission over the Internet is 100% secure.
				</p>
			</section>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>
					5. Children&apos;s Privacy
				</h2>
				<p className='mb-4'>
					Our Service complies with COPPA (Children&apos;s Online
					Privacy Protection Act). We do not knowingly collect
					personal information from children under 13 without parental
					consent.
				</p>
			</section>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>
					6. Changes to This Privacy Policy
				</h2>
				<p className='mb-4'>
					We may update this policy periodically. Any changes will be
					posted on this page with an updated effective date.
				</p>
			</section>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>7. Contact Us</h2>
				<p className='mb-4'>
					If you have any questions about this Privacy Policy, please
					contact us at:
					<br />
					Email: support@feynmanlearning.com
					<br />
					Address: Charlotte, North Carolina, United States
				</p>
			</section>

			<footer className='text-sm text-gray-600 mt-8'>
				This policy is governed by the laws of North Carolina, United
				States.
			</footer>
		</div>
	);
}
