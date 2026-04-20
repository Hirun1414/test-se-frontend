'use client'

import { useState, useEffect } from 'react';
import getRoomServices from '@/libs/getRoomServices';

export default function RoomServiceDisplay({ hotelId }: { hotelId: string }) {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                const data = await getRoomServices(hotelId);
                if (data.success) {
                    setServices(data.data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) loadServices();
    }, [hotelId]);

    if (loading) return <div className="text-gray-400 text-sm p-4">กำลังโหลดบริการ...</div>;

    return (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 h-full">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Room Services</h2>
            <div className="space-y-3">
                {services.length > 0 ? (
                    services.map((service) => (
                        <div key={service._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">{service.name}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    service.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    {service.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 text-sm py-4">ไม่มีข้อมูลบริการ</p>
                )}
            </div>
        </div>
    );
}