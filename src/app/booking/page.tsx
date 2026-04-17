import getHotels from "@/libs/getHotels";
import BookingClient from "@/components/BookingClient";

export default async function BookingPage() {
    const hotels = await getHotels();

    return <BookingClient hotels={hotels} />;
}