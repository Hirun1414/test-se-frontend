export default async function getHotel(id:string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/hotels/${id}`, { cache: 'no-store' })
    if(!response.ok) {
        throw new Error("Failed to fetch hotels");
    }

    return await response.json();
}