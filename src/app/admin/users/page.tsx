import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import getUsers from "@/libs/getUsers";
import UsersAdminTable from "./UsersAdminTable";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/api/auth/signin');

    const isPomPhet = session.user.role === 'PomPhet';
    if (!['admin', 'PomPhet'].includes(session.user.role)) redirect('/admin/dashboard');

    const users = await getUsers(session.user.token).catch(
        () => ({ success: false, count: 0, data: [] } as UserJson)
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">จัดการผู้ใช้</h1>
            </div>
            {!isPomPhet && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    คุณมีสิทธิ์ดูข้อมูลผู้ใช้ได้เท่านั้น การแก้ไขต้องใช้สิทธิ์ Super Admin
                </div>
            )}
            <UsersAdminTable users={users} isPomPhet={isPomPhet} />
        </div>
    );
}
