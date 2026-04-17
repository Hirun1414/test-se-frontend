import getHotels from "@/libs/getHotels";
import Link from "next/link";
import HotelsAdminTable from "./HotelsAdminTable";

export default async function AdminHotelsPage() {
    const hotels = await getHotels();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">จัดการโรงแรม</h1>
                <Link href="/admin/hotels/new">
                    <div className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors">
                        + เพิ่มโรงแรมใหม่
                    </div>
                    
                </Link>
            </div>
            <HotelsAdminTable hotels={hotels} />
        </div>
    );
}
