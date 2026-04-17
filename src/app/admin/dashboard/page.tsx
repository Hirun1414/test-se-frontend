import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getHotels from "@/libs/getHotels";
import getBookings from "@/libs/getBookings";
import Link from "next/link";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const token = session!.user.token;

    const [hotels, bookings] = await Promise.all([
        getHotels(),
        getBookings(token).catch(() => ({ success: false, count: 0, data: [] } as ApiBookingJson)),
    ]);

    const stats = [
        { label: 'โรงแรมทั้งหมด', value: hotels.count, icon: '🏨', href: '/admin/hotels' },
        { label: 'การจองทั้งหมด', value: bookings.count, icon: '📅', href: '/admin/bookings' },
    ];

    const recent = bookings.data?.filter((b) => b.hotel?.name).slice(0, 5) ?? [];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">แดชบอร์ด</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {stats.map((s) => (
                    <Link
                        key={s.label}
                        href={s.href}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="text-3xl mb-3">{s.icon}</div>
                        <div className="text-3xl font-bold text-gray-800">{s.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">การจองล่าสุด</h2>
                    <Link href="/admin/bookings" className="text-sm text-green-700 hover:underline">
                        ดูทั้งหมด →
                    </Link>
                </div>
                {recent.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">ไม่มีข้อมูลการจอง</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                                <th className="pb-2 font-medium">โรงแรม</th>
                                <th className="pb-2 font-medium">วันเข้าพัก</th>
                                <th className="pb-2 font-medium">วันที่จอง</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((b) => (
                                <tr key={b._id} className="border-b border-gray-50">
                                    <td className="py-2.5 text-gray-700">{b.hotel?.name}</td>
                                    <td className="py-2.5 text-gray-600">
                                        {new Date(b.apptDate).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="py-2.5 text-gray-400">
                                        {new Date(b.createdAt).toLocaleDateString('th-TH')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link href="/admin/hotels/new" className="bg-white rounded-xl border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow text-center">
                    + เพิ่มโรงแรมใหม่
                </Link>
                <Link href="/admin/hotels" className="bg-white rounded-xl border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow text-center">
                    จัดการโรงแรม
                </Link>
                <Link href="/admin/bookings" className="bg-white rounded-xl border border-gray-200 p-4 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow text-center">
                    จัดการการจอง
                </Link>
            </div>
        </div>
    );
}
