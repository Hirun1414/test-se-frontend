'use client'

import { useState, useTransition } from "react";
import { deleteBookingAction, updateBookingAction } from "./actions";

export default function BookingsAdminTable({ bookings }: { bookings: ApiBookingJson }) {
    const [pending, startTransition] = useTransition();
    const [editId, setEditId] = useState<string | null>(null);
    const [editDate, setEditDate] = useState('');

    const handleDelete = (id: string) => {
        if (!window.confirm('ต้องการลบการจองนี้?')) return;
        startTransition(() => deleteBookingAction(id));
    };

    const handleEditSave = (id: string) => {
        if (!editDate) return;
        startTransition(async () => {
            try {
                const res = await updateBookingAction(id, editDate);
                if (res && res.success === false) {
                    alert(res.message);
                } else {
                    setEditId(null);
                }
            } catch (error: any) {
                alert(error.message || "An unexpected error occurred.");
            }
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3 font-medium">ชื่อผู้ใช้</th>
                        <th className="px-4 py-3 font-medium">โรงแรม</th>
                        <th className="px-4 py-3 font-medium">จังหวัด</th>
                        <th className="px-4 py-3 font-medium">วันเข้าพัก</th>
                        <th className="px-4 py-3 font-medium">วันที่จอง</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {bookings.data.filter((b) => b.hotel?.name && b.user).map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 text-sm">
                                <div className="font-medium">{typeof b.user === 'object' ? b.user?.name : b.user}</div>
                                {typeof b.user === 'object' && b.user?.email && (
                                    <div className="text-xs text-gray-400">{b.user.email}</div>
                                )}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800">{b.hotel?.name}</td>
                            <td className="px-4 py-3 text-gray-500">{b.hotel?.province ?? '-'}</td>
                            <td className="px-4 py-3 text-gray-600">
                                {editId === b._id ? (
                                    <input
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                        className="px-2 py-1 border border-green-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                ) : (
                                    new Date(b.apptDate).toLocaleDateString('th-TH')
                                )}
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {new Date(b.createdAt).toLocaleDateString('th-TH')}
                            </td>
                            <td className="px-4 py-3">
                                {editId === b._id ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditSave(b._id)}
                                            disabled={pending}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-green-700 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50"
                                        >
                                            บันทึก
                                        </button>
                                        <button
                                            onClick={() => setEditId(null)}
                                            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50"
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditId(b._id);
                                                setEditDate(b.apptDate.slice(0, 10));
                                            }}
                                            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b._id)}
                                            disabled={pending}
                                            className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {bookings.data.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">ไม่มีข้อมูลการจอง</p>
            )}
        </div>
    );
}
