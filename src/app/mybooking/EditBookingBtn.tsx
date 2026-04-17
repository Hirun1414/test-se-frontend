'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditBookingBtn({ bookingId, currentDate }: { bookingId: string; currentDate: string }) {
    const [editing, setEditing] = useState(false);
    const [newDate, setNewDate] = useState(currentDate.slice(0, 10));
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSave = () => {
        if (!newDate) return;
        setError('');
        startTransition(async () => {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apptDate: newDate }),
            });
            if (res.ok) {
                setEditing(false);
                router.refresh();
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message ?? 'แก้ไขไม่สำเร็จ');
            }
        });
    };

    if (!editing) {
        return (
            <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-sm font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
                แก้ไขวันจอง
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-2 items-end">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="px-2 py-1.5 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                    onClick={handleSave}
                    disabled={pending}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                    {pending ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
                <button
                    onClick={() => { setEditing(false); setError(''); }}
                    disabled={pending}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    ยกเลิก
                </button>
            </div>
        </div>
    );
}
