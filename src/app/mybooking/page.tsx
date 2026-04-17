import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import getBookings from "@/libs/getBookings";
import Link from "next/link";
import CancelBookingBtn from "./CancelBookingBtn";
import EditBookingBtn from "./EditBookingBtn";

export default async function MyBookingPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/api/auth/signin');

    const bookings = await getBookings(session.user.token).catch(() => ({ success: false, count: 0, data: [] } as ApiBookingJson));
    // For admin, backend returns ALL bookings — filter to only show the admin's own bookings
    const myBookings = bookings.data.filter((b) => {
        if (!b.hotel?.name) return false;
        if (session.user.role === 'admin') {
            const userId = typeof b.user === 'object' ? b.user?._id : b.user;
            return userId === session.user._id;
        }
        return true;
    });

    if (myBookings.length === 0) {
        return (
            <main className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="text-5xl">🏨</div>
                <h3 className="text-xl font-semibold text-gray-700">ยังไม่มีการจอง</h3>
                <p className="text-gray-400 text-sm">เริ่มค้นหาโรงแรมที่ใช่สำหรับคุณได้เลย</p>
                <Link href="/hotel">
                    <div className="mt-2 px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors">
                        ค้นหาโรงแรม
                    </div>
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">รายการจองของฉัน</h1>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {myBookings.length} รายการ
                </span>
            </div>
            <div className="flex flex-col gap-4">
                {myBookings.map((b) => (
                    <div key={b._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">🏨 {b.hotel.name}</h3>
                                <div className="mt-2 flex flex-col gap-1">
                                    <p className="text-sm text-gray-500">📍 {b.hotel.province}</p>
                                    <p className="text-sm text-gray-500">📞 {b.hotel.tel}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-medium text-green-700">
                                    📅 {new Date(b.apptDate).toLocaleDateString('th-TH')}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    จองเมื่อ {new Date(b.createdAt).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                            <EditBookingBtn bookingId={b._id} currentDate={b.apptDate} />
                            <CancelBookingBtn bookingId={b._id} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
