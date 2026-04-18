export default async function createBooking(hotelId: string, apptDate: string, services: { serviceId: string; quantity: number }[] = []) {
    const response = await fetch(`/api/bookings/${hotelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apptDate, services }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? 'ไม่สามารถจองได้');
    }

    return data;
}
