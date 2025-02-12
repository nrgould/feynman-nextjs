import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://www.feynlearn.com',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: 'https://www.feynlearn.com/plans',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: 'https://www.feynlearn.com/waitlist',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
	];
}
