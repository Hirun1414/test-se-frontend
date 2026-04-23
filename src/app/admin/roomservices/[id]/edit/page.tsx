"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { TextField, MenuItem, CircularProgress, Alert } from "@mui/material";

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "pending", label: "Pending" },
  { value: "unavailable", label: "Unavailable" },
];

export default function EditRoomServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("available");
  const [minAmount, setMinAmount] = useState<number>(1);
  const [maxAmount, setMaxAmount] = useState<number>(10);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/roomservices/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          const s = result.data;
          setName(s.name);
          setDescription(s.description);
          setStatus(s.status);
          setMinAmount(s.minAmount ?? 1);
          setMaxAmount(s.maxAmount ?? 10);
        } else {
          setError(result.message || "Failed to load room service.");
        }
        setFetchLoading(false);
      })
      .catch(() => {
        setError("Network error. Failed to load room service.");
        setFetchLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (minAmount <= 0) {
      setError("Minimum amount must be greater than zero.");
      return;
    }
    if (maxAmount < minAmount) {
      setError("Maximum amount must not be less than minimum amount.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/roomservices/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, description, status, minAmount, maxAmount }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert("อัปเดตบริการเรียบร้อยแล้ว!");
        router.back()
      } else {
        setError(result.message || "Failed to update room service.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading)
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Room Service</h1>
        <p className="text-gray-500 mb-8 text-sm">แก้ไขข้อมูลบริการของโรงแรม</p>

        {error && <Alert severity="error" className="mb-6">{error}</Alert>}
        {success && <Alert severity="success" className="mb-6">Updated Successfully!</Alert>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            label="ชื่อบริการ"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            label="รายละเอียดบริการ"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            select
            label="สถานะ"
            variant="outlined"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="จำนวนขั้นต่ำ"
            type="number"
            variant="outlined"
            fullWidth
            value={minAmount}
            onChange={(e) => setMinAmount(Number(e.target.value))}
            required
            inputProps={{ min: 1 }}
            error={minAmount <= 0}
            helperText={minAmount <= 0 ? "จำนวนขั้นต่ำต้องมากกว่าศูนย์" : ""}
          />

          <TextField
            label="จำนวนสูงสุด"
            type="number"
            variant="outlined"
            fullWidth
            value={maxAmount}
            onChange={(e) => setMaxAmount(Number(e.target.value))}
            required
            inputProps={{ min: 1 }}
            error={maxAmount < minAmount}
            helperText={maxAmount < minAmount ? "จำนวนสูงสุดต้องไม่น้อยกว่าจำนวนขั้นต่ำ" : ""}
          />

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-md active:scale-95 disabled:bg-gray-300"
            >
              {loading ? "กำลังบันทึก..." : "ยืนยันการแก้ไข"}
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