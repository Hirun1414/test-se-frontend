'use client'

import { useState, useEffect, useRef, use } from "react";
import getHotel from "@/libs/getHotel";
import EditHotelForm from "./EditHotelForm";
import RoomServiceList from "./RoomServiceList";
import CreateRoomServiceForm from "./CreateRoomServiceForm";
import { CircularProgress } from "@mui/material";

export default function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
    // แกะ id ออกจาก params
    const { id } = use(params);
    
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // สร้างรีโมท (Ref) เพื่อไว้สั่งให้ RoomServiceList รีเฟรชข้อมูล
    const serviceListRef = useRef<{ refresh: () => void }>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data } = await getHotel(id);
                setHotel(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><CircularProgress /></div>;
    if (!hotel) return <div>Hotel not found</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ฝั่งซ้าย: แก้ไขข้อมูลโรงแรม */}
                <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขโรงแรม</h1>
                    <EditHotelForm hotel={hotel} />
                </div>

                {/* ฝั่งขวา: จัดการ Room Service (งาน US1-6 ของคุณ) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* รายการบริการ - ใส่ Ref ไว้รับคำสั่งจากฟอร์มด้านบน */}
                    <RoomServiceList 
                        hotelId={id} 
                        ref={serviceListRef} 
                    />


                    {/* ฟอร์มเพิ่มบริการ - เมื่อเพิ่มสำเร็จจะสั่งให้ Ref ด้านล่างทำงาน */}
                    <CreateRoomServiceForm 
                        hotelId={id} 
                        onCreated={() => serviceListRef.current?.refresh()} 
                    />
                    
                    
                    
                </div>

            </div>
        </div>
    );
}