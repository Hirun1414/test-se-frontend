'use client'

import { useState } from "react";
import { TextField, Alert, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react"; // เพิ่มบรรทัดนี้

export default function CreateRoomServiceForm({ hotelId, onCreated }: { hotelId: string, onCreated: () => void }) {
    const { data: session } = useSession(); // ดึงข้อมูล Session จาก NextAuth
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [minQuantity, setMinQuantity] = useState<number>(1);
    const [maxQuantity, setMaxQuantity] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (minQuantity < 1) {
            setError("จำนวนขั้นต่ำต้องไม่น้อยกว่า 1");
            return;
        }
        if (maxQuantity < minQuantity) {
            setError("จำนวนสูงสุดต้องมากกว่าหรือเท่ากับจำนวนขั้นต่ำ");
            return;
        }

        // ดึง Token จาก Session (รองรับทั้งแบบ session.token และ session.user.token)
        const token = (session as any)?.user?.token || (session as any)?.token;

        if (!token) {
            setError("ไม่พบ Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`/api/hotels/${hotelId}/roomservices`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name, 
                    description, 
                    minQuantity: Number(minQuantity), 
                    maxQuantity: Number(maxQuantity) 
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "ชื่อบริการซ้ำ");
            }
            
            setName("");
            setDescription("");
            setMinQuantity(1);
            setMaxQuantity(10);
            onCreated(); 
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">เพิ่มบริการใหม่</h3>
            
            {error && <Alert severity="error" className="mb-4 py-1">{error}</Alert>}
            
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <TextField label="ชื่อบริการ (เช่น Extra Towels)" variant="outlined" fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)} required />
                <TextField label="รายละเอียด (Description)" variant="outlined" fullWidth size="small" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <div className="flex gap-4">
                    <TextField label="จำนวนขั้นต่ำ (Min)" type="number" variant="outlined" fullWidth size="small" value={minQuantity} onChange={(e) => setMinQuantity(Number(e.target.value))} required />
                    <TextField label="จำนวนสูงสุด (Max)" type="number" variant="outlined" fullWidth size="small" value={maxQuantity} onChange={(e) => setMaxQuantity(Number(e.target.value))} required />
                </div>
                <button type="submit" disabled={loading} className="w-full py-2 bg-green-700 text-white text-sm font-bold rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-300">
                    {loading ? <CircularProgress size={20} color="inherit" /> : "ยืนยันการเพิ่ม"}
                </button>
            </form>
        </div>
    );
}