'use client'

import { useState } from "react";
import { TextField, Alert, CircularProgress } from "@mui/material";

export default function CreateRoomServiceForm({ hotelId, onCreated }: { hotelId: string, onCreated: () => void }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // เงื่อนไข AC2: ราคาห้ามติดลบ
        if (Number(price) < 0) {
            setError("ราคาไม่สามารถติดลบได้");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`/api/v1/hotels/${hotelId}/roomservices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price: Number(price) })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "บริการนี้มีอยู่แล้วในระบบ");
            }
            
            setName("");
            setPrice("");
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
                <TextField 
                    label="ชื่อบริการ" 
                    variant="outlined" 
                    fullWidth 
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField 
                    label="ราคา (บาท)" 
                    type="number" 
                    variant="outlined" 
                    fullWidth 
                    size="small"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={Number(price) < 0}
                    required
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-green-700 text-white text-sm font-bold rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-300"
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "ยืนยันการเพิ่ม"}
                </button>
            </form>
        </div>
    );
}