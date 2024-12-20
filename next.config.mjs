/** @type {import('next').NextConfig} */
const nextConfig = {
	logging: {
		level: 'debug',
		fetch: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
