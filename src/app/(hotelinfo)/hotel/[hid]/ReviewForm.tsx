'use client'

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        if (!showDeleteModal) return;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [showDeleteModal]);

    const handleDelete = () => {
        if (!existingReview) return;
        setError(null);
        startTransition(async () => {
            const res = await deleteReview(hotelId, existingReview._id);
            if (res.success) {
                setShowDeleteModal(false);
                router.refresh();
            } else {
                setShowDeleteModal(false);
                setError(res.message ?? 'ไม่สามารถลบรีวิวได้');
            }
        });
    };

    if (existingReview && !isEditing) {
        return (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">รีวิวของคุณ</h3>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span
                                key={s}
                                className={`text-2xl ${s <= existingReview.score ? 'text-amber-400' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                                setError(null);
                                setScore(existingReview.score);
                                setComment(existingReview.comment);
                                setIsEditing(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-100 transition disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            แก้ไข
                        </button>
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                            </svg>
                            ลบ
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{existingReview.comment}</p>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                {showDeleteModal && typeof document !== 'undefined' && createPortal(
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                        onClick={() => !isPending && setShowDeleteModal(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-review-title"
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 id="delete-review-title" className="text-lg font-semibold text-gray-800">
                                    ลบรีวิวนี้ไหม
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isPending}
                                    aria-label="ปิด"
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 text-xl leading-none"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-5">
                                รีวิวที่ลบไปแล้วจะไม่สามารถกู้คืนได้
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-sm px-4 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition disabled:opacity-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={handleDelete}
                                    className="text-sm px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {isPending ? 'กำลังลบ...' : 'ลบ'}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
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
            {isEditing && comment.trim().length === 0 && (
                <p className="text-xs text-red-500 mt-1">รีวิวไม่สามารถเว้นว่างได้</p>
            )}
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
