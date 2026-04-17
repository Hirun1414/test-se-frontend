'use client'

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import getHotels from "@/libs/getHotels";

export default function CardPanel() {
    const [hotelResponse, setHotelResponse] = useState<HotelJson | null>(null);

    useEffect(() => {
        getHotels().then(setHotelResponse);
    }, []);

    if (!hotelResponse) {
        return <p className="text-center py-10 text-gray-400">กำลังโหลด...</p>;
    }

    return (
        <div className="px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 my-5">
                {hotelResponse.data.map((hotelItem: HotelItem) => (
                    <Link href={`/hotel/${hotelItem.id}`} key={hotelItem.id}>
                        <Card
                            hotelName={hotelItem.name}
                            imgSrc={hotelItem.picture}
                            province={hotelItem.province}
                            dailyrate={hotelItem.dailyrate}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
