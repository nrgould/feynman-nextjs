const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getUsers() {
	try {
		const response = await fetch(`${BASE_URL}/api/user`);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}
