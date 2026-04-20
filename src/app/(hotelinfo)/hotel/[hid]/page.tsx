import Image from "next/image";
import Link from "next/link";
import getHotel from "@/libs/getHotel";
import HotelBookingPanel from "@/components/HotelBookingPanel";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function HotelDetailPage({ params }: { params: Promise<{ hid: string }> }) {
    const { hid } = await params;
    const { data: hotel } = await getHotel(hid);
    const session = await getServerSession(authOptions);

    const avgRating = hotel.reviews && hotel.reviews.length > 0
        ? (hotel.reviews.reduce((acc: number, r: { score: number }) => acc + r.score, 0) / hotel.reviews.length).toFixed(1)
        : null;

    const existingReview = session?.user && hotel.reviews
        ? hotel.reviews.find((r: ReviewItem) =>
            r.user && typeof r.user === 'object'
                ? r.user._id === session.user._id
                : r.user === session.user._id
        )
        : null;

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <Link href="/hotel" className="text-sm text-green-700 hover:underline mb-6 inline-block">
                ← กลับไปรายการโรงแรม
            </Link>

            <div className="relative w-full h-[50vh] rounded-2xl overflow-hidden mb-8">
                <Image
                    src={hotel.picture}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
                {avgRating && (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                        <span className="text-amber-500 text-lg">★</span>
                        <span className="text-lg font-bold text-amber-600">{avgRating}</span>
                        <span className="text-sm font-normal text-amber-500/80">({hotel.reviews?.length} รีวิว)</span>
                    </div>
                 )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
                        <span className="text-gray-400 font-medium">ที่อยู่</span>
                        <span className="text-gray-700">{hotel.address}</span>

                        <span className="text-gray-400 font-medium">อำเภอ/เขต</span>
                        <span className="text-gray-700">{hotel.district}</span>

                        <span className="text-gray-400 font-medium">จังหวัด</span>
                        <span className="text-gray-700">{hotel.province}</span>

                        <span className="text-gray-400 font-medium">รหัสไปรษณีย์</span>
                        <span className="text-gray-700">{hotel.postalcode}</span>

                        {hotel.region && (
                            <>
                                <span className="text-gray-400 font-medium">Region</span>
                                <span className="text-gray-700">{hotel.region}</span>
                            </>
                        )}

                        <span className="text-gray-400 font-medium">เบอร์โทรศัพท์</span>
                        <span className="text-gray-700">
                            <a href={`tel:${hotel.tel}`} className="hover:underline">{hotel.tel}</a>
                        </span>
                    </div>

                    <div className="text-2xl font-bold text-amber-500 mt-2">
                        ฿{hotel.dailyrate?.toLocaleString() ?? 'N/A'}
                        <span className="text-base font-normal text-gray-400 ml-1">/ คืน</span>
                    </div>

                    {session && (
                        <div className="mt-4">
                            <ReviewForm hotelId={hid} existingReview={existingReview} />
                        </div>
                    )}
                </div>

                <div className="self-start">
                    <HotelBookingPanel hotelId={hid} hotelName={hotel.name} />
                </div>
            </div>

            <ReviewList reviews={hotel.reviews} currentUserId={session?.user?._id ?? null} />
        </main>
    );
}
