'use client'

import { useState, useTransition } from 'react';
import { voteReview } from './actions';

interface ReviewLikeButtonsProps {
    reviewId: string;
    hotelId: string;
    initialLikes: string[];
    initialDislikes: string[];
    currentUserId: string | null;
    /** When false, dislike count is hidden (shown as —). Admin-only visibility. */
    showDislikeCount?: boolean;
}

export default function ReviewLikeButtons({
    reviewId,
    hotelId,
    initialLikes,
    initialDislikes,
    currentUserId,
    showDislikeCount = false,
}: ReviewLikeButtonsProps) {
    const [likes, setLikes] = useState<string[]>(initialLikes);
    const [dislikes, setDislikes] = useState<string[]>(initialDislikes);
    const [isPending, startTransition] = useTransition();

    const hasLiked = currentUserId ? likes.includes(currentUserId) : false;
    const hasDisliked = currentUserId ? dislikes.includes(currentUserId) : false;

    const handleVote = (action: 'like' | 'dislike') => {
        if (!currentUserId) return; // not logged in – buttons are disabled anyway

        // Optimistic update
        const prevLikes = [...likes];
        const prevDislikes = [...dislikes];

        if (action === 'like') {
            if (hasLiked) {
                setLikes(likes.filter((id) => id !== currentUserId));
            } else {
                setLikes([...likes.filter((id) => id !== currentUserId), currentUserId]);
                setDislikes(dislikes.filter((id) => id !== currentUserId));
            }
        } else {
            if (hasDisliked) {
                setDislikes(dislikes.filter((id) => id !== currentUserId));
            } else {
                setDislikes([...dislikes.filter((id) => id !== currentUserId), currentUserId]);
                setLikes(likes.filter((id) => id !== currentUserId));
            }
        }

        startTransition(async () => {
            const res = await voteReview(hotelId, reviewId, action);
            if (res.success && res.likes && res.dislikes) {
                setLikes(res.likes);
                setDislikes(res.dislikes);
            } else {
                // Rollback on error
                setLikes(prevLikes);
                setDislikes(prevDislikes);
            }
        });
    };

    return (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            {/* Like button */}
            <button
                type="button"
                disabled={!currentUserId || isPending}
                onClick={() => handleVote('like')}
                title={currentUserId ? (hasLiked ? 'เอาไลค์คืน' : 'ถูกใจรีวิวนี้') : 'กรุณาเข้าสู่ระบบ'}
                className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    border transition-all duration-200 select-none
                    ${hasLiked
                        ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {/* Thumb up SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={hasLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span>{likes.length}</span>
            </button>

            {/* Dislike button */}
            <button
                type="button"
                disabled={!currentUserId || isPending}
                onClick={() => handleVote('dislike')}
                title={currentUserId ? (hasDisliked ? 'เอาดิสไลค์คืน' : 'ไม่ถูกใจรีวิวนี้') : 'กรุณาเข้าสู่ระบบ'}
                className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    border transition-all duration-200 select-none
                    ${hasDisliked
                        ? 'bg-red-50 border-red-300 text-red-600 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {/* Thumb down SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={hasDisliked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                </svg>
                <span>
                    {showDislikeCount ? dislikes.length : null}
                </span>
            </button>
        </div>
    );
}
