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

                    <div className="mt-3 flex gap-3 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="flex-shrink-0 w-4 h-4 mt-0.5 text-green-700"
                            aria-hidden="true"
                        >
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 mb-1">การคุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                ระบบจัดเก็บชื่อ เบอร์โทร และอีเมลเพื่อใช้ยืนยันตัวตนและให้บริการจองที่พักเท่านั้น รหัสผ่านถูกเข้ารหัสก่อนจัดเก็บ และจะไม่เปิดเผยต่อบุคคลภายนอก ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                            </p>
                        </div>
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-green-700 cursor-pointer flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                            ข้าพเจ้าได้อ่านและ<span className="font-medium text-gray-800">ยินยอม</span>ให้เก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลของข้าพเจ้าตามเงื่อนไขข้างต้น
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
