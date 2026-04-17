'use client'

import DateReserve from "@/components/DateReserve";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import createBooking from "@/libs/createBooking";

export default function BookingClient({ hotels }: { hotels: HotelJson }) {
    const urlParams = useSearchParams();
    const hid = urlParams.get('id');
    const selectedHotel = hotels.data.find(v => v._id === hid);
    const router = useRouter();

    const [bookDate, setBookDate] = useState<Dayjs | null>(null);
    const [bookLocation, setBookLocation] = useState(hid ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [booked, setBooked] = useState(false);

    const makeBooking = async () => {
        if (!bookDate || !bookLocation) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await createBooking(bookLocation, bookDate.format('YYYY-MM-DD'));
            setBooked(true);
        } catch (err: any) {
            const msg: string = err.message ?? '';
            setError(msg.includes('already made 3 bookings')
                ? 'คุณมีการจองครบ 3 รายการแล้ว กรุณายกเลิกการจองเก่าก่อน'
                : msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    if (booked) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">จองสำเร็จ!</h2>
                <p className="text-gray-500 mb-8 text-sm">การจองของคุณได้รับการบันทึกเรียบร้อยแล้ว</p>
                <Link href="/mybooking">
                    <div className="inline-block px-6 py-2.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors text-sm">
                        ดูรายการจองของฉัน
                    </div>
                </Link>
            </div>
        );
    }

    return (
        <main className="max-w-lg mx-auto px-4 py-8">
            <div className="mb-5">
                <Link href="/hotel" className="text-sm text-green-700 hover:underline">
                    ← กลับไปรายการโรงแรม
                </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">จองห้องพัก</h1>
                {selectedHotel && (
                    <p className="text-gray-500 text-sm mb-6">
                        โรงแรม:{" "}
                        <span className="font-medium text-gray-700">{selectedHotel.name}</span>
                    </p>
                )}

                {error && (
                    <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">วันเข้าพักและสถานที่</p>
                        <DateReserve
                            locationId={hid ?? ''}
                            hotelsJson={hotels}
                            onDateChange={(value: Dayjs | null) => setBookDate(value)}
                            onLocationChange={(value: string) => setBookLocation(value)}
                        />
                    </div>
                    <button
                        className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={makeBooking}
                        disabled={loading}
                    >
                        {loading ? 'กำลังจอง...' : 'ยืนยันการจอง'}
                    </button>
                </div>
            </div>
        </main>
    );
}
