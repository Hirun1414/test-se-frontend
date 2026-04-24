"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "pending", label: "Coming Soon" },
  { value: "unavailable", label: "Out of Stock" },
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
  const [confirmDelete, setConfirmDelete] = useState(false);

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
          setMinAmount(s.minQuantity ?? 1);
          setMaxAmount(s.maxQuantity ?? 10);
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
      const response = await fetch(`/api/roomservices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          status,
          minQuantity: minAmount,
          maxQuantity: maxAmount,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert("อัปเดตบริการเรียบร้อยแล้ว!");
        router.back();
      } else {
        setError(result.message || "Failed to update room service.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/roomservices/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        alert("ลบบริการเรียบร้อยแล้ว!");
        router.back();
      } else {
        setError(result.message || "Failed to delete room service.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  if (fetchLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border border-gray-100 p-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Edit Room Service
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            แก้ไขข้อมูลบริการของโรงแรม
          </p>
        </div>

        {/* Alerts */}
        {error && <Alert severity="error" className="mb-6">{error}</Alert>}
        {success && <Alert severity="success" className="mb-6">Updated Successfully!</Alert>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Service Info */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              ข้อมูลบริการ
            </h2>

            <TextField
              label="ชื่อบริการ"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              size="small"
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                },
              }}
            />

            <TextField
              label="รายละเอียดบริการ"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              size="small"
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                },
              }}
            />
          </div>

          {/* Status */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              สถานะ
            </h2>

            <TextField
              select
              label="สถานะ"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              size="small"
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              จำนวนการให้บริการ
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="จำนวนขั้นต่ำ"
                type="number"
                fullWidth
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                required
                size="small"
                margin="normal"
                inputProps={{ min: 1 }}
                error={minAmount <= 0}
                helperText={
                  minAmount <= 0
                    ? "จำนวนขั้นต่ำต้องมากกว่าศูนย์"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fafafa",
                  },
                }}
              />

              <TextField
                label="จำนวนสูงสุด"
                type="number"
                fullWidth
                value={maxAmount}
                onChange={(e) => setMaxAmount(Number(e.target.value))}
                required
                size="small"
                margin="normal"
                inputProps={{ min: 1 }}
                error={maxAmount < minAmount}
                helperText={
                  maxAmount < minAmount
                    ? "จำนวนสูงสุดต้องไม่น้อยกว่าจำนวนขั้นต่ำ"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fafafa",
                  },
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-sm active:scale-95 disabled:bg-gray-300"
            >
              {loading ? "กำลังบันทึก..." : "ยืนยันการแก้ไข"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                confirmDelete 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {confirmDelete ? "ยืนยันการลบ (กดอีกครั้ง)" : "ลบบริการนี้"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all"
            >
              ยกเลิก
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}