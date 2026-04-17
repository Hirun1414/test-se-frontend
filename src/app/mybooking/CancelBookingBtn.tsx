'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CancelBookingBtn({ bookingId }: { bookingId: string }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCancel = () => {
        if (!window.confirm('ต้องการยกเลิกการจองนี้?')) return;
        startTransition(async () => {
            const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message ?? 'ยกเลิกไม่สำเร็จ');
            }
        });
    };

    return (
        <div className="flex flex-col items-end gap-1">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
                onClick={handleCancel}
                disabled={pending}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
                {pending ? 'กำลังยกเลิก...' : 'ยกเลิกการจอง'}
            </button>
        </div>
    );
}
