import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/api/auth/signin');
    if (!['admin', 'PomPhet'].includes(session.user.role)) redirect('/');

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <aside className="w-56 bg-white border-r border-gray-200 fixed top-16 left-0 h-[calc(100vh-64px)] flex flex-col z-40">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin Panel</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{session.user.name}</p>
                </div>
                <nav className="flex-1 p-3 flex flex-col gap-0.5">
                    {session.user.role === 'admin' && (
                        <Link href="/admin/dashboard" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                            📊 Dashboard
                        </Link>
                    )}
                    {session.user.role === 'admin' && (
                        <Link href="/admin/bookings" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                            📅 จัดการการจอง
                        </Link>
                    )}
                    {(session.user.role === 'PomPhet' || session.user.role === 'admin') && (
                        <Link href="/admin/hotels" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                            🏨 จัดการโรงแรม
                        </Link>
                    )}
                    {session.user.role === 'PomPhet' && (
                        <Link href="/admin/users" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                            👥 จัดการผู้ใช้
                        </Link>
                    )}
                </nav>
                <div className="p-3 border-t border-gray-100">
                    <Link href="/" className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-1 transition-colors">
                        ← กลับสู่หน้าหลัก
                    </Link>
                </div>
            </aside>
            <main className="ml-56 flex-1 p-8 min-w-0">
                {children}
            </main>
        </div>
    );
}
