"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getHotels from "@/libs/getHotels"; 
import { TextField, MenuItem, CircularProgress, Alert } from "@mui/material";
import { useSession } from "next-auth/react"; // เพิ่มบรรทัดนี้

export default function CreateRoomServicePage() {
    const router = useRouter();
    const { data: session } = useSession(); // ดึงข้อมูล Session
    
    const [hotels, setHotels] = useState<any[]>([]);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [minQuantity, setMinQuantity] = useState<number>(1);
    const [maxQuantity, setMaxQuantity] = useState<number>(10);
    
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

        if (minQuantity < 1) {
            setError("จำนวนขั้นต่ำต้องไม่น้อยกว่า 1");
            return;
        }
        if (maxQuantity < minQuantity) {
            setError("จำนวนสูงสุดต้องมากกว่าหรือเท่ากับจำนวนขั้นต่ำ");
            return;
        }

        // ดึง Token จาก Session
        const token = (session as any)?.user?.token || (session as any)?.token;

        if (!token) {
            setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/v1/hotels/${selectedHotel}/roomservices`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ส่ง Token ไปให้ Backend
                },
                body: JSON.stringify({ 
                    name, 
                    description, 
                    minQuantity: Number(minQuantity), 
                    maxQuantity: Number(maxQuantity) 
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                alert("เพิ่มบริการเรียบร้อยแล้ว!");
                router.push("/admin/roomservices"); 
            } else {
                setError(result.message || "เกิดข้อผิดพลาดในการสร้างบริการ");
            }
        } catch (err: any) {
            setError("ไม่สามารถเชื่อมต่อกับ Server ได้ กรุณาลองใหม่อีกครั้ง");
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
                    <TextField select label="เลือกโรงแรมที่ต้องการเพิ่มบริการ" variant="outlined" fullWidth value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} required>
                        {hotels.map((hotel) => (
                            <MenuItem key={hotel.id} value={hotel.id}>{hotel.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="ชื่อบริการ (เช่น Spa, Extra Bed)" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField label="รายละเอียด (Description)" variant="outlined" fullWidth multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <div className="flex gap-4">
                        <TextField label="จำนวนขั้นต่ำ" type="number" variant="outlined" fullWidth value={minQuantity} onChange={(e) => setMinQuantity(Number(e.target.value))} required />
                        <TextField label="จำนวนสูงสุด" type="number" variant="outlined" fullWidth value={maxQuantity} onChange={(e) => setMaxQuantity(Number(e.target.value))} required />
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        <button type="submit" disabled={loading} className="w-full py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-md active:scale-95 disabled:bg-gray-300">
                            {loading ? "กำลังบันทึก..." : "ยืนยันการเพิ่มบริการ"}
                        </button>
                        <button type="button" onClick={() => router.back()} className="w-full py-3 bg-white text-gray-500 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}