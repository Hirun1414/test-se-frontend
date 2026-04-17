'use client'

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { deleteHotelAction } from "./actions";

export default function HotelsAdminTable({ hotels }: { hotels: HotelJson }) {
    const [pending, startTransition] = useTransition();

    const handleDelete = (id: string, name: string) => {
        if (!window.confirm(`ต้องการลบ "${name}" ?\nการลบจะลบการจองที่เกี่ยวข้องทั้งหมดด้วย`)) return;
        startTransition(() => deleteHotelAction(id));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3 font-medium">รูป</th>
                        <th className="px-4 py-3 font-medium">ชื่อโรงแรม</th>
                        <th className="px-4 py-3 font-medium">จังหวัด</th>
                        <th className="px-4 py-3 font-medium">ราคา/คืน</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {hotels.data.map((hotel) => (
                        <tr key={hotel._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                    <Image src={hotel.picture} alt={hotel.name} fill className="object-cover" />
                                </div>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800">{hotel.name}</td>
                            <td className="px-4 py-3 text-gray-500">{hotel.province}</td>
                            <td className="px-4 py-3 font-semibold text-amber-500">
                                ฿{hotel.dailyrate.toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/hotels/${hotel._id}/edit`}
                                        className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        แก้ไข
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(hotel._id, hotel.name)}
                                        disabled={pending}
                                        className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        ลบ
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {hotels.data.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">ไม่มีข้อมูลโรงแรม</p>
            )}
        </div>
    );
}
