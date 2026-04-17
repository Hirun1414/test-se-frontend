"use client"

import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeBooking } from "@/redux/features/bookSlice";
import Link from "next/link";

export default function BookingList() {
    const hotelItems = useAppSelector((state) => state.bookSlice.bookItems);
    const dispatch = useDispatch<AppDispatch>();

    if (hotelItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="text-5xl">🏨</div>
                <h3 className="text-xl font-semibold text-gray-700">ยังไม่มีการจอง</h3>
                <p className="text-gray-400 text-sm">เริ่มค้นหาโรงแรมที่ใช่สำหรับคุณได้เลย</p>
                <Link href="/hotel">
                    <div className="mt-2 px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors">
                        ค้นหาโรงแรม
                    </div>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">รายการจองของฉัน</h1>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {hotelItems.length} / 3 รายการ
                </span>
            </div>
            <div className="flex flex-col gap-4">
                {hotelItems.map((item: BookingItem) => (
                    <div
                        key={item.hotel + item.bookDate}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">🏨 {item.hotel}</h3>
                                <div className="mt-2 flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">👤 {item.nameLastname}</p>
                                    <p className="text-sm text-gray-500">📞 {item.tel}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-medium text-green-700">📅 {item.bookDate}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => dispatch(removeBooking(item))}
                                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                ยกเลิกการจอง
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
