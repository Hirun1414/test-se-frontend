import getHotel from "@/libs/getHotel";
import EditHotelForm from "./EditHotelForm";

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: hotel } = await getHotel(id);

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขโรงแรม</h1>
            <EditHotelForm hotel={hotel} />
        </div>
    );
}
