'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateHotelAction } from "../../actions";


const fields = [
    { key: 'name', label: 'ชื่อโรงแรม' },
    { key: 'address', label: 'ที่อยู่' },
    { key: 'district', label: 'อำเภอ/เขต' },
    { key: 'province', label: 'จังหวัด' },
    { key: 'postalcode', label: 'รหัสไปรษณีย์' },
    { key: 'tel', label: 'เบอร์โทร' },
    { key: 'picture', label: 'URL รูปภาพ' },
    { key: 'dailyrate', label: 'ราคาต่อคืน (บาท)', type: 'number' },
] as const;

export default function EditHotelForm({ hotel }: { hotel: HotelItem }) {
    const [form, setForm] = useState({
        name: hotel.name,
        address: hotel.address,
        district: hotel.district,
        province: hotel.province,
        postalcode: hotel.postalcode,
        tel: hotel.tel,
        region: hotel.region ?? '',
        picture: hotel.picture,
        dailyrate: String(hotel.dailyrate),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateHotelAction(hotel._id, { ...form, dailyrate: Number(form.dailyrate) });
        } catch (err: any) {
            if (!err.message?.includes('NEXT_REDIRECT')) setError(err.message ?? 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200">
                {fields.map((f) => (
                    <div key={f.key} className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">{f.label}</label>
                        <input
                            type={('type' in f ? f.type : undefined) ?? 'text'}
                            required
                            value={form[f.key]}
                            onChange={(e) => set(f.key, e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                    </div>
                ))}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Region</label>
                    <input
                        type="text"
                        value={form.region}
                        onChange={(e) => set('region', e.target.value)}
                        placeholder="e.g. Central, ภาคเหนือ"
                        className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                </div>

                {form.picture && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={form.picture} alt="Preview" fill className="object-cover" onError={() => {}} />
                    </div>
                )}

                <div className="flex gap-3 mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors disabled:opacity-60"
                    >
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </button>
                    <Link
                        href="/admin/hotels"
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ยกเลิก
                    </Link>
                </div>
            </form>
        </>
    );
}
