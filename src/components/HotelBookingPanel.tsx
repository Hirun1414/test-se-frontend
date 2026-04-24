'use client'

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSession } from 'next-auth/react';
import { Dayjs } from 'dayjs';
import Link from 'next/link';
import createBooking from '@/libs/createBooking';
import getRoomServices from '@/libs/getRoomServices';

interface Service {
    serviceId: string;
    name: string;
    description: string;
    status: string;
    min: number;
    max: number;
}

export default function HotelBookingPanel({ hotelId, hotelName }: { hotelId: string; hotelName: string }) {
    const { data: session } = useSession();

    const [date, setDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const servicesWithCount = selectedServices.map(id => ({
        serviceId: id,
        quantity: counts[id] ?? services.find(s => s.serviceId === id)?.min ?? 1
    }));
    const [loadingServices, setLoadingServices] = useState(false);

    // Fetch hotel services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoadingServices(true);
                const data = await getRoomServices(hotelId);
                if (data.success && Array.isArray(data.data)) {
                    const mappedServices = data.data.map((service: any) => ({
                    serviceId: service._id,
                    name: service.name,
                    description: service.description,
                    status: service.status,
                     min: service.minAmount ?? 1,    
                    max: service.maxAmount ?? 10    
                    }));
                    setServices(mappedServices);
                }
            } catch (err) {
                console.error('Failed to fetch services:', err);
            } finally {
                setLoadingServices(false);
            }
        };

        if (hotelId) {
            fetchServices();
        }
    }, [hotelId]);

    if (!session) {
        return (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center flex flex-col items-center gap-4">
                <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อจองห้องพัก</p>
                <Link href="/api/auth/signin">
                    <div className="px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors">
                        เข้าสู่ระบบ
                    </div>
                </Link>
            </div>
        );
    }

    if (done) {
        return (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center flex flex-col items-center gap-3">
                <div className="text-4xl">✅</div>
                <h3 className="font-semibold text-green-800">จองสำเร็จ!</h3>
                <p className="text-green-600 text-sm">การจองของคุณได้รับการบันทึกแล้ว</p>
                <Link href="/mybooking">
                    <div className="inline-block px-6 py-2.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors text-sm">
                        ดูรายการจองของฉัน
                    </div>
                </Link>
            </div>
        );
    }

    const handleToggleService = (serviceId: string) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleBook = async () => {
        if (!date) {
            setError('กรุณาเลือกวันเข้าพัก');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await createBooking(hotelId, date.format('YYYY-MM-DD'), servicesWithCount);
            setDone(true);
        } catch (err: any) {
            const msg: string = err.message ?? '';
            setError(msg.includes('already made 3 bookings')
                ? 'คุณมีการจองครบ 3 รายการแล้ว กรุณายกเลิกการจองเก่าก่อน'
                : msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    const selectedServicesList = services.filter(s => selectedServices.includes(s.serviceId));


    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">จองห้องพัก</h2>
            <p className="text-sm text-gray-400 mb-5">{hotelName}</p>

            {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-4 flex-1">
                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="วันเข้าพัก"
                        value={date}
                        onChange={(v) => setDate(v)}
                        disablePast
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                </LocalizationProvider>

                {/* Services Section */}
                <div className="flex-1 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">บริการเพิ่มเติม</h3>
                    
                    {loadingServices ? (
                        <p className="text-sm text-gray-500">กำลังโหลดบริการ...</p>
                    ) : services.length === 0 ? (
                        <p className="text-sm text-gray-500">ไม่มีบริการเพิ่มเติม</p>
                    ) : (
                        <div className="space-y-2 mb-4">
                            {services.map((service) => (
                                <label key={service.serviceId} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.includes(service.serviceId)}
                                        onChange={() => handleToggleService(service.serviceId)}
                                        disabled={service.status !== 'available'}
                                        className="w-4 h-4 mt-1 rounded border-gray-300 text-green-700 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">{service.name} ({service.max})</p>
                                        <p className="text-xs text-gray-500">{service.description}</p>
                                        {service.status !== 'available' && (
                                            <p className="text-xs text-red-600">ไม่พร้อมให้บริการ</p>
                                        )}
                                    </div>
                                    {selectedServices.includes(service.serviceId) && (
                                    <input
                                        type="number"
                                        value={
                                        counts[service.serviceId] !== undefined
                                            ? counts[service.serviceId]
                                            : service.min
                                        }

                                        min={service.min}
                                        max={service.max}

                                        onChange={(e) => {
                                            const raw = e.target.value;

                                            if (raw === "") {
                                                setCounts(prev => {
                                                const next = { ...prev };
                                                delete next[service.serviceId];
                                                return next;
                                                });
                                                return;
                                            }

                                            const val = parseInt(raw, 10);

                                            if (!isNaN(val)) {
                                                setCounts(prev => ({
                                                ...prev,
                                                [service.serviceId]: val
                                                }));
                                            }
                                        }}

                                        onBlur={() => {
                                            let val = counts[service.serviceId];

                                            if (val === undefined) val = service.min;

                                            if (val < service.min) val = service.min;
                                            if (val > service.max) val = service.max;

                                            setCounts(prev => ({
                                                ...prev,
                                                [service.serviceId]: val
                                            }));
                                        }}

                                        className="w-16 h-8 border rounded px-2 text-sm"
                                    />
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Services Summary */}
                {selectedServicesList.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-900 mb-2">บริการที่เลือก:</p>
                        <div className="space-y-1">
                            {selectedServicesList.map((service) => (
                                <div key={service.serviceId} className="text-xs text-blue-800 flex items-center gap-2">
                                    <span>✓</span>
                                    <span>{service.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Book Button - Fixed at bottom */}
            <button
                onClick={handleBook}
                disabled={loading}
                className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        กำลังจอง...
                    </>
                ) : 'จองเลย'}
            </button>
        </div>
    );
}
