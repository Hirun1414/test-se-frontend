import Image from 'next/image';
import InteractiveCard from './InteractiveCard';

export default function Card({
    hotelName,
    imgSrc,
    province,
    dailyrate,
    reviews,
}: {
    hotelName: string;
    imgSrc: string;
    province?: string;
    dailyrate?: number;
    reviews?: { score: number }[];
}) {
    const avgRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <InteractiveCard contentName={hotelName}>
            <div className="w-full h-48 relative">
                <Image
                    src={imgSrc}
                    alt="Hotel Picture"
                    fill
                    className="object-cover rounded-t-lg"
                />
            </div>
            <div className="px-3 pt-3 pb-4 flex flex-col gap-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-[17px] text-gray-800 truncate">{hotelName}</h3>
                    {avgRating && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="text-sm font-semibold text-amber-600">{avgRating}</span>
                        </div>
                    )}
                </div>
                {province && (
                    <p className="text-sm text-gray-500">📍 {province}</p>
                )}
                {dailyrate !== undefined && (
                    <p className="text-[15px] font-bold text-amber-500">
                        ฿{dailyrate.toLocaleString()} <span className="font-normal text-gray-400 text-xs">/ คืน</span>
                    </p>
                )}
            </div>
        </InteractiveCard>
    );
}
