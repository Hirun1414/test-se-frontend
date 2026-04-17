import Card from "@/components/Card";
import Link from "next/link";

export default async function HotelCatalog({ hotelsJson }: { hotelsJson: Promise<HotelJson> }) {
    const hotelJsonReady = await Promise.resolve(hotelsJson);

    return (
        <div className="px-6 py-4">
            <p className="text-sm text-gray-500 mb-6">พบ {hotelJsonReady.count} โรงแรม</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotelJsonReady.data.map((hotelItem: HotelItem) => (
                    <Link href={`/hotel/${hotelItem.id}`} key={hotelItem.id}>
                        <Card
                            hotelName={hotelItem.name}
                            imgSrc={hotelItem.picture}
                            province={hotelItem.province}
                            dailyrate={hotelItem.dailyrate}
                            reviews={hotelItem.reviews}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
