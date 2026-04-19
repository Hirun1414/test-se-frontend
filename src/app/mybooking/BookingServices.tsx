'use client'

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingServices({ bookingId, hotelId, services, availableServices = [] }: { bookingId: string, hotelId: string, services: any[], availableServices?: any[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const serviceCountMap = Object.fromEntries(
        (services || []).map((entry: any) => {
            const id = entry?.service?._id || entry?.service;
            return [id, entry?.count ?? entry?.quantity];
        })
    );
    const [localServices, setLocalServices] = useState<any[]>([]);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const handleEditClick = () => {
        if (!isEditing) {
            setLocalServices(Array.isArray(services) ? [...services] : []);
            setIsEditing(true);
        } else {
            // Save to DB when clicking "เสร็จสิ้น"
            const payload = localServices.map((entry) => {
                let serviceId = entry?.service?._id || entry?.service;
                // Just in case it comes back nested
                if (typeof serviceId === 'object' && serviceId && '$oid' in serviceId) {
                    serviceId = serviceId.$oid;
                }

                const id = entry?.service?._id || entry?.service;

                return {
                    serviceId: serviceId,
                    quantity: counts[id] ?? entry?.count ?? entry?.service.minQuantity
                };
            });

            console.log("BookingServices: Sending PUT payload to update DB:", { services: payload });

            startTransition(async () => {
                try {
                    const res = await fetch(`/api/bookings/${bookingId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ services: payload })
                    });
                    
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        console.error('Save failed:', data);
                        alert(`แก้ไขไม่สำเร็จ: ${data.message || res.statusText || 'เซิร์ฟเวอร์ไม่ตอบสนอง'}`);
                        // Optionally keep them in edit mode if it failed
                        return;
                    }

                    setIsEditing(false);
                    router.refresh();
                } catch (error) {
                    console.error('Fetch error:', error);
                    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
                }
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleCheckboxChange = (serviceId: string, checked: boolean, quantity: number) => {
        setLocalServices(prev => {
            const newServices = [...prev];
            if (checked) {
                // Add service
                newServices.push({ service: serviceId, status: 'pending', count: quantity });
            } else {
                // Remove service
                const idx = newServices.findIndex(entry => (entry?.service?._id || entry?.service) === serviceId);
                if (idx !== -1) newServices.splice(idx, 1);
            }
            return newServices;
        });
    };

    // Use localServices for checked state if editing, otherwise original services
    const bookedServiceIds = (isEditing ? localServices : (Array.isArray(services) ? services : []))
        .map(entry => (entry?.service?._id || entry?.service));

    if ((!Array.isArray(services) || services.length === 0) && availableServices.length === 0) {
        return (
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-700">บริการเสริมที่เลือก</div>
                </div>
                <p className="text-sm text-gray-500">โรงเเรมนี้ไม่มีบริการเสริม</p>
            </div>
        );
    }

    return (
        <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700">บริการเสริมที่เลือก</div>
                {availableServices.length > 0 && (
                    <div className="flex items-center gap-2">
                        {isEditing && (
                            <button 
                                onClick={handleCancel}
                                disabled={pending}
                                className="px-3 py-1 text-xs font-medium text-gray-500 border border-transparent rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                ยกเลิก
                            </button>
                        )}
                        <button 
                            onClick={handleEditClick}
                            disabled={pending}
                            className={`px-3 py-1 text-xs font-medium border rounded-lg transition-colors disabled:opacity-50 ${
                                isEditing 
                                ? 'text-white bg-green-600 border-green-600 hover:bg-green-700'
                                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {pending ? 'กำลังบันทึก...' : (isEditing ? 'เสร็จสิ้น' : 'แก้ไขบริการเสริม')}
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    {availableServices.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">ไม่มีบริการเสริมให้เลือก</p>
                    ) : (
                        availableServices.map((service: any) => {
                            const isChecked = bookedServiceIds.includes(service._id);
                            return (
                                <label 
                                    key={service._id} 
                                    className={`flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${
                                        pending ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 mt-1 rounded border-gray-300 text-green-700 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        checked={isChecked}
                                        disabled={pending || service.status !== 'available'}
                                        onChange={(e) => handleCheckboxChange(service._id, e.target.checked, service.minQuantity)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">
                                            {service.name} {service.maxQuantity ? `(${service.maxQuantity})` : ''}
                                        </p>
                                        <p className="text-xs text-gray-500">{service.description}</p>
                                        {service.status !== 'available' && (
                                            <p className="text-xs text-red-600 mt-1">ไม่พร้อมให้บริการ</p>
                                        )}
                                    </div>
                                    {bookedServiceIds.includes(service._id) && (
                                    <input
                                        type="number"
                                        value={
                                        counts[service._id] !== undefined
                                            ? counts[service._id]
                                            : serviceCountMap?.[service._id] ?? service.minQuantity ?? 1
                                        }

                                        min={service.minQuantity}
                                        max={service.maxQuantity}

                                        onChange={(e) => {
                                            const raw = e.target.value;

                                            if (raw === "") {
                                                setCounts(prev => {
                                                const next = { ...prev };
                                                delete next[service._id];
                                                return next;
                                                });
                                                return;
                                            }

                                            const val = parseInt(raw, 10);

                                            if (!isNaN(val)) {
                                                setCounts(prev => ({
                                                ...prev,
                                                [service._id]: val
                                                }));
                                            }
                                        }}

                                        onBlur={() => {
                                            let val = counts[service._id];

                                            if (val === undefined) val = service.minQuantity;

                                            if (val < service.minQuantity) val = service.minQuantity;
                                            if (val > service.maxQuantity) val = service.maxQuantity;

                                            setCounts(prev => ({
                                                ...prev,
                                                [service._id]: val
                                            }));
                                        }}

                                        className="w-16 h-8 border rounded px-2 text-sm"
                                    />
                                    )}
                                </label>
                            );
                        })
                    )}
                </div>
            ) : (
                <>
                {!Array.isArray(services) || services.length === 0 ? (
                    <p className="text-sm text-gray-500">ยังไม่มีบริการเสริม (กดแก้ไขเพื่อเพิ่ม)</p>
                ) : (
                    <div className="space-y-3">
                        {services.map((entry: any, index: number) => {
                            const service = entry?.service ? entry.service : entry;
                            const status = entry?.status || service?.status || 'pending';
                            const badgeColor =
                                status === 'done' ? 'bg-green-100 text-green-800' :
                                status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-700';

                            return (
                                <div key={service?._id ?? index} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-gray-200">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{service?.name ?? 'บริการไม่ทราบชื่อ'}</p>
                                        {service?.description && <p className="text-xs text-gray-500">{service.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${badgeColor}`}>
                                            {entry?.count ?? 1}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${badgeColor}`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                </>
            )}
        </div>
    );
}
