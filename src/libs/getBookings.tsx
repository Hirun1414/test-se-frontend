export default async function getBookings(token: string): Promise<ApiBookingJson> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }

    return response.json();
}
