'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import getRoomServices from '@/libs/getRoomServices';

const statusStyle: Record<string, string> = {
  available: 'bg-green-100 text-green-600',
  pending:   'bg-yellow-100 text-yellow-600',
  unavailable: 'bg-red-100 text-red-600',
};

const RoomServiceList = forwardRef(({ hotelId }: { hotelId: string }, ref) => {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadServices = async () => {
    if (!hotelId) return;
    try {
      setLoading(true);
      const data = await getRoomServices(hotelId);
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ refresh: loadServices }));

  useEffect(() => {
    loadServices();
  }, [hotelId]);

  const handleDelete = async (serviceId: string, serviceName: string) => {
    if (!window.confirm(`ต้องการลบบริการ "${serviceName}" ?\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      setDeletingId(serviceId);
      const response = await fetch(`/api/roomservices/${serviceId}`, {
        method: 'DELETE',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'ไม่สามารถลบบริการได้');
      }

      setServices((prev) => prev.filter((service) => service._id !== serviceId));
    } catch (error: any) {
      alert(error.message || 'เกิดข้อผิดพลาดในการลบบริการ');
    } finally {
      setDeletingId(null);
    }
  };

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
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    statusStyle[service.status] ?? statusStyle.available
                  }`}>
                    {service.status || 'available'}
                  </span>
                  <button
                    onClick={() => router.push(`/admin/roomservices/${service._id}/edit`)}
                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(service._id, service.name)}
                    disabled={deletingId === service._id}
                    className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === service._id ? 'กำลังลบ...' : 'ลบ'}
                  </button>
                </div>
              </div>
              {service.description && (
                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
              )}
              {(service.minAmount !== undefined || service.maxAmount !== undefined) && (
                <p className="text-xs text-gray-400 mt-1">
                  จำนวน: {service.minAmount ?? 1} – {service.maxAmount ?? 10}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm py-4">ยังไม่มีบริการ</p>
        )}
      </div>
    </div>
  );
});

RoomServiceList.displayName = "RoomServiceList";
export default RoomServiceList;