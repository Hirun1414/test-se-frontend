import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBookings from "@/libs/getBookings";
import BookingsAdminTable from "./BookingsAdminTable";

export default async function AdminBookingsPage() {
    const session = await getServerSession(authOptions);
    const bookings = await getBookings(session!.user.token).catch(
        () => ({ success: false, count: 0, data: [] } as ApiBookingJson)
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">จัดการการจอง</h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {bookings.count} รายการ
                </span>
            </div>
            <BookingsAdminTable bookings={bookings} />
        </div>
    );
}
