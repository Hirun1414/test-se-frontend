export default async function getUsers(token: string): Promise<UserJson> {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/users?limit=10000`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}
