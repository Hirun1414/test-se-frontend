'use client'

import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSession } from 'next-auth/react';
import { Dayjs } from 'dayjs';
import Link from 'next/link';
import createBooking from '@/libs/createBooking';

export default function HotelBookingPanel({ hotelId, hotelName }: { hotelId: string; hotelName: string }) {
    const { data: session } = useSession();

    const [date, setDate] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

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

    const handleBook = async () => {
        if (!date) {
            setError('กรุณาเลือกวันเข้าพัก');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await createBooking(hotelId, date.format('YYYY-MM-DD'));
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

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">จองห้องพัก</h2>
            <p className="text-sm text-gray-400 mb-5">{hotelName}</p>

            {error && (
                <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="วันเข้าพัก"
                        value={date}
                        onChange={(v) => setDate(v)}
                        disablePast
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                </LocalizationProvider>

                <button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                            กำลังจอง...
                        </>
                    ) : 'จองเลย'}
                </button>
            </div>
        </div>
    );
}
