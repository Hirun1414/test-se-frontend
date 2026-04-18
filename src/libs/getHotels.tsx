export default async function getHotels() {

    /*await new Promise((resolve) => setTimeout(resolve, 2000))*/

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hotels`, { cache: 'no-store' })
    if(!response.ok) {
        throw new Error("Failed to fetch hotels");
    }

    return await response.json();
}