import Banner from "@/components/Banner";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Banner />

            <section className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-12">
                        จองง่ายใน 3 ขั้นตอน
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl">
                                🔍
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">ค้นหาโรงแรม</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                เลือกโรงแรมที่ตรงใจจากรายการทั่วประเทศ พร้อมข้อมูลและรูปภาพจริง
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl">
                                📅
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">เลือกวันเข้าพัก</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                กำหนดวันที่ต้องการเข้าพักได้อย่างอิสระ ตรวจสอบราคาก่อนจอง
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl">
                                ✅
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">ยืนยันการจอง</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                ยืนยันการจองและดูสรุปรายการจองของคุณได้ทันที
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-14 px-6 bg-gray-50 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    พร้อมจองที่พักแล้วหรือยัง?
                </h2>
                <p className="text-gray-500 mb-7 text-sm">
                    ค้นพบโรงแรมที่ใช่สำหรับทุกการเดินทาง
                </p>
                <Link href="/hotel">
                    <div className="inline-block px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors text-sm">
                        ดูโรงแรมทั้งหมด
                    </div>
                </Link>
            </section>
        </main>
    );
}
