'use client'

import { useTransition } from "react";
import { toggleBanAction, deleteUserAction } from "./actions";

const roleLabel: Record<string, string> = {
    user: 'ผู้ใช้',
    admin: 'แอดมิน',
    PomPhet: 'PomPhet',
};

const roleBadgeColor: Record<string, string> = {
    user: 'bg-green-100 text-green-800',
    admin: 'bg-orange-100 text-orange-700',
    PomPhet: 'bg-purple-100 text-purple-700',
};

export default function UsersAdminTable({
    users,
    isPomPhet,
}: {
    users: UserJson;
    isPomPhet: boolean;
}) {
    const [pending, startTransition] = useTransition();

    const handleBanToggle = (id: string, currentBan: boolean) => {
        const action = currentBan ? 'ปลดแบน' : 'แบน';
        if (!window.confirm(`ต้องการ${action}ผู้ใช้นี้?`)) return;
        startTransition(() => toggleBanAction(id, !currentBan));
    };

    const handleDelete = (id: string, name: string) => {
        if (!window.confirm(`ต้องการลบผู้ใช้ "${name}" ?\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) return;
        startTransition(() => deleteUserAction(id));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3 font-medium">ชื่อ</th>
                        <th className="px-4 py-3 font-medium">อีเมล</th>
                        <th className="px-4 py-3 font-medium">เบอร์โทร</th>
                        <th className="px-4 py-3 font-medium">สิทธิ์</th>
                        <th className="px-4 py-3 font-medium">สถานะ</th>
                        {isPomPhet && <th className="px-4 py-3 font-medium">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.data.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                            <td className="px-4 py-3 text-gray-500">{user.email}</td>
                            <td className="px-4 py-3 text-gray-500">{user.tel || '-'}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColor[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                                    {roleLabel[user.role] ?? user.role}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${user.isban ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                    {user.isban ? 'ถูกระงับ' : 'ใช้งานปกติ'}
                                </span>
                            </td>
                            {isPomPhet && (
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleBanToggle(user._id, user.isban)}
                                            disabled={pending}
                                            className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors disabled:opacity-50 ${user.isban ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-orange-200 text-orange-500 hover:bg-orange-50'}`}
                                        >
                                            {user.isban ? 'ปลดแบน' : 'แบน'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id, user.name)}
                                            disabled={pending}
                                            className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.data.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">ไม่มีข้อมูลผู้ใช้</p>
            )}
        </div>
    );
}
