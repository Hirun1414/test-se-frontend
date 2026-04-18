'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitReview, updateReview, deleteReview } from './actions';

const MAX_COMMENT = 500;

export default function ReviewForm({
    hotelId,
    existingReview,
}: {
    hotelId: string;
    existingReview?: { _id: string; score: number; comment: string } | null;
}) {
    const [score, setScore] = useState(existingReview?.score ?? 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment ?? '');
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (existingReview && !isEditing) {
        return (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">รีวิวของคุณ</h3>
                <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <span
                            key={s}
                            className={`text-2xl ${s <= existingReview.score ? 'text-amber-400' : 'text-gray-300'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap mb-3">{existingReview.comment}</p>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                            setError(null);
                            setScore(existingReview.score);
                            setComment(existingReview.comment);
                            setIsEditing(true);
                        }}
                        className="text-xs text-amber-600 hover:underline disabled:opacity-50"
                    >
                        แก้ไขรีวิว
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                            if (!confirm('ลบรีวิวของคุณ?')) return;
                            setError(null);
                            startTransition(async () => {
                                const res = await deleteReview(hotelId, existingReview._id);
                                if (res.success) {
                                    router.refresh();
                                } else {
                                    setError(res.message ?? 'ไม่สามารถลบรีวิวได้');
                                }
                            });
                        }}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                    >
                        {isPending ? 'กำลังลบ...' : 'ลบรีวิว'}
                    </button>
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>
        );
    }

    const canSubmit = comment.trim().length > 0 && score > 0 && !isPending;
    const isDirty = isEditing
        ? (score !== existingReview?.score || comment.trim() !== (existingReview?.comment ?? '').trim())
        : true;

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            const res = isEditing && existingReview
                ? await updateReview(hotelId, existingReview._id, score, comment.trim())
                : await submitReview(hotelId, score, comment.trim());
            if (res.success) {
                if (isEditing) {
                    setIsEditing(false);
                } else {
                    setScore(0);
                    setComment('');
                }
                router.refresh();
            } else {
                setError(res.message ?? (isEditing ? 'ไม่สามารถแก้ไขรีวิวได้' : 'ไม่สามารถส่งรีวิวได้'));
            }
        });
    };

    const handleCancelEdit = () => {
        setError(null);
        setScore(existingReview?.score ?? 0);
        setComment(existingReview?.comment ?? '');
        setIsEditing(false);
    };

    return (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {isEditing ? 'แก้ไขรีวิวของคุณ' : 'เขียนรีวิวโรงแรมนี้'}
            </h3>
            <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        disabled={isPending}
                        className={`text-2xl transition-colors cursor-pointer focus:outline-none ${(hover || score) >= s ? 'text-amber-400' : 'text-gray-300'
                            }`}
                        onClick={() => setScore(s)}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="เล่าประสบการณ์ของคุณ..."
                maxLength={MAX_COMMENT}
                rows={3}
                disabled={isPending}
                className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            />
            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                    {comment.length}/{MAX_COMMENT}
                </span>
                <div className="flex items-center gap-2">
                    {isEditing && (
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleCancelEdit}
                            className="text-sm px-4 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
                        >
                            ยกเลิก
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={!canSubmit || (isEditing && !isDirty)}
                        onClick={handleSubmit}
                        className="text-sm px-4 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        {isPending
                            ? (isEditing ? 'กำลังบันทึก...' : 'กำลังส่ง...')
                            : (isEditing ? 'บันทึกการแก้ไข' : 'ส่งรีวิว')}
                    </button>
                </div>
            </div>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
    );
}
