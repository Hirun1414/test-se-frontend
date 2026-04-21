"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getHotels from "@/libs/getHotels"; 
import { TextField, MenuItem, CircularProgress, Alert } from "@mui/material";

export default function CreateRoomServicePage() {
    const router = useRouter();
    
    const [hotels, setHotels] = useState<any[]>([]);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState<number>(0);
    
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // ดึงข้อมูลโรงแรมมาใส่ Dropdown ตามสไตล์ไฟล์ CardPanel.tsx ที่เพื่อนคุณทำ
    useEffect(() => {
        getHotels().then((res) => {
            if (res) setHotels(res.data);
            setFetchLoading(false);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // ดัก Error ตาม AC: ราคาห้ามติดลบ
        if (price < 0) {
            setError("Invalid input: Price cannot be a negative number.");
            return;
        }

        setLoading(true);
        try {
            // ยิง API ไปที่ Backend (Path นี้อ้างอิงตามมาตรฐานโปรเจกต์คุณ)
            const response = await fetch(`/api/v1/hotels/${selectedHotel}/roomservices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: serviceName, price: price })
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                alert("เพิ่มบริการเรียบร้อยแล้ว!");
                router.push("/admin/roomservices"); // เพิ่มเสร็จแล้วเด้งกลับหน้าหลัก
            } else {
                // ดัก Error ตาม AC: ถ้าบริการซ้ำ
                setError(result.message || "This room service already existed.");
            }
        } catch (err: any) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="flex justify-center py-20"><CircularProgress /></div>;

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Room Service</h1>
                <p className="text-gray-500 mb-8 text-sm">สร้างบริการใหม่สำหรับโรงแรมในระบบ</p>
                
                {error && <Alert severity="error" className="mb-6">{error}</Alert>}
                {success && <Alert severity="success" className="mb-6">Created Successfully!</Alert>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* เลือกโรงแรม (Acceptance Criteria 1) */}
                    <TextField
                        select
                        label="เลือกโรงแรมที่ต้องการเพิ่มบริการ"
                        variant="outlined"
                        fullWidth
                        value={selectedHotel}
                        onChange={(e) => setSelectedHotel(e.target.value)}
                        required
                    >
                        {hotels.map((hotel) => (
                            <MenuItem key={hotel.id} value={hotel.id}>
                                {hotel.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="ชื่อบริการ (เช่น Spa, Breakfast)"
                        variant="outlined"
                        fullWidth
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />

                    <TextField
                        label="ราคาบริการ (บาท)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                        error={price < 0}
                        helperText={price < 0 ? "ราคาห้ามติดลบ" : ""}
                    />

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-md active:scale-95 disabled:bg-gray-300"
                        >
                            {loading ? "กำลังบันทึก..." : "ยืนยันการเพิ่มบริการ"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full py-3 bg-white text-gray-500 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}