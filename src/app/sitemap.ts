import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://www.feynlearn.com';
	const imageBaseUrl = `${baseUrl}/images`;

	// All available images
	const images = [
		'logo.png',
		'kinesthetic.png',
		'linear-path.png',
		'studying.svg',
		'brain.svg',
		'classroom.svg',
		'school.svg',
		'diploma.svg',
		'calc.svg',
		'systemAvatar.png',
	];

	return [
		// Main pages
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		// Manage routes
		{
			url: `${baseUrl}/plans`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/waitlist`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/account`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${baseUrl}/settings`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/onboarding`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/policies`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		// Playground routes
		{
			url: `${baseUrl}/feynman-technique`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
			images: [
				`${imageBaseUrl}/studying.svg`,
				`${imageBaseUrl}/brain.svg`,
			],
		},
		{
			url: `${baseUrl}/learning-path`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
			images: [`${imageBaseUrl}/linear-path.png`],
		},
		{
			url: `${baseUrl}/drag-drop-math`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
			images: [`${imageBaseUrl}/calc.svg`],
		},
		// Other main routes
		{
			url: `${baseUrl}/concepts`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/try-concepts`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/learn`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
			images: [
				`${imageBaseUrl}/classroom.svg`,
				`${imageBaseUrl}/school.svg`,
			],
		},
		{
			url: `${baseUrl}/chat`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		// Image sitemap entries
		...images.map((image) => ({
			url: `${imageBaseUrl}/${image}`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.5,
		})),
	];
}

// example code

// export default function sitemap(): MetadataRoute.Sitemap {
//   return [
//     {
//       url: 'https://example.com',
//       lastModified: '2021-01-01',
//       changeFrequency: 'weekly',
//       priority: 0.5,
//       images: ['https://example.com/image.jpg'],
//     },
//   ]
// }
