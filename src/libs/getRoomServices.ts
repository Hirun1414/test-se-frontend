export default async function getRoomServices(hotelId: string) {
    const response = await fetch(`/api/roomservices/hotel/${hotelId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch room services");
    }
    return await response.json();
}