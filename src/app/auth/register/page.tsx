'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import userRegister from "@/libs/userRegister";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        if (password.length < 6) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }

        if (!consent) {
            setError("กรุณายอมรับนโยบายความเป็นส่วนตัวก่อนสมัครสมาชิก");
            return;
        }

        setLoading(true);

        try {
            await userRegister(name, tel, email, password, role);

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("สมัครสมาชิกสำเร็จ แต่เข้าสู่ระบบไม่ได้ กรุณาลองใหม่");
                router.push("/auth/signin");
            } else {
                router.push("/hotel");
            }
        } catch (err: any) {
            setError(err.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                    <span className="text-2xl font-bold text-green-700">KingOporII</span>
                    <h1 className="text-2xl font-bold text-gray-800 mt-3">สมัครสมาชิก</h1>
                </div>

                {error && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">ชื่อ</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ชื่อ-นามสกุล"
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทร</label>
                        <input
                            type="tel"
                            required
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            placeholder="0XX-XXX-XXXX"
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">อีเมล</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="อย่างน้อย 6 ตัวอักษร"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                            >
                                {showPassword ? "ซ่อน" : "แสดง"}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">ประเภทบัญชี</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
                        >
                            <option value="user">ผู้ใช้ทั่วไป</option>
                            <option value="admin">แอดมิน</option>
                            <option value="PomPhet">PomPhet</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                    </div>

                    <details className="group mt-2 px-4 py-3 bg-[#FAF3E0]/60 border border-gray-200 rounded-lg">
                        <summary className="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center justify-between hover:text-green-700 marker:hidden [&::-webkit-details-marker]:hidden">
                            <span>นโยบายความเป็นส่วนตัว</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200"
                            >
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </summary>
                        <ul className="mt-3 text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>เก็บชื่อ เบอร์โทร อีเมล เพื่อการสมัคร ยืนยันตัวตน และการจอง</li>
                            <li>รหัสผ่านถูก hash ก่อนจัดเก็บ ทีมงานดูไม่ได้</li>
                            <li>ไม่เปิดเผยต่อบุคคลที่สาม ยกเว้นที่กฎหมายกำหนด</li>
                            <li>เก็บข้อมูลตราบเท่าที่บัญชียังใช้งาน หรือจนกว่าจะร้องขอให้ลบ</li>
                        </ul>
                    </details>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-green-700 cursor-pointer flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                            ฉันได้อ่านและ<span className="font-medium text-gray-800">ยินยอม</span>ให้ระบบจัดเก็บและประมวลผลข้อมูลส่วนบุคคลของฉันตามนโยบายความเป็นส่วนตัวข้างต้น
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading || !consent}
                        className="mt-2 w-full py-2.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    มีบัญชีแล้ว?{" "}
                    <Link href="/auth/signin" className="text-green-700 hover:underline font-medium">
                        เข้าสู่ระบบ
                    </Link>
                </p>
            </div>
        </div>
    );
}
