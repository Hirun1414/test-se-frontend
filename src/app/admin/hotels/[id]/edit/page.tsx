import getHotel from "@/libs/getHotel";
import EditHotelForm from "./EditHotelForm";
import RoomServiceList from "./RoomServiceList";

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: hotel } = await getHotel(id);

    return (
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขโรงแรม</h1>
                    <EditHotelForm hotel={hotel} />
                </div>

                <div className="lg:col-span-5">
                    <RoomServiceList hotelId={id} />
                </div>

            </div>
        </div>
    );
}