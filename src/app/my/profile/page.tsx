import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/api/auth/signin');

    const { name, email, tel, role } = session.user;
    const initial = name?.[0]?.toUpperCase() ?? '?';

    return (
        <main className="max-w-lg mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">โปรไฟล์</h1>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                        {initial}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                        <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 ${roleBadgeColor[role] ?? 'bg-gray-100 text-gray-700'}`}>
                            {roleLabel[role] ?? role}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">อีเมล</span>
                        <span className="text-gray-700">{email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">เบอร์โทร</span>
                        <span className="text-gray-700">{tel || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">สิทธิ์</span>
                        <span className="text-gray-700">{roleLabel[role] ?? role}</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                    <Link
                        href="/mybooking"
                        className="px-5 py-2.5 text-sm font-semibold text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        รายการจองของฉัน
                    </Link>
                    <Link
                        href="/api/auth/signout"
                        className="px-5 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        ออกจากระบบ
                    </Link>
                </div>
            </div>
        </main>
    );
}
