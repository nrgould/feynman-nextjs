import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			// Uncomment and modify these as needed
			disallow: ['/api/', '/admin/', '/private/'],
		},
		sitemap: 'https://www.feynlearn.com/sitemap.xml',
	};
}
