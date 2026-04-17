'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitRating } from './actions';

export default function StarRating({ hotelId, initialRating, readOnly = false }: { hotelId: string, initialRating: number, readOnly?: boolean }) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = (value: number) => {
        if (readOnly) return;
        setRating(value);
        startTransition(async () => {
            const success = await submitRating(hotelId, value);
            if (success) {
                router.refresh(); // Refresh page to update main hotel data
            } else {
                alert('Failed to submit rating. Please try again.');
                setRating(initialRating); // revert
            }
        });
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly || isPending}
                    className={`text-2xl transition-colors focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'
                        } ${(hover || rating) >= star ? 'text-amber-400' : 'text-gray-300'}`}
                    onClick={() => handleClick(star === rating ? 0 : star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    ★
                </button>
            ))}
            {isPending && <span className="text-xs text-gray-400 ml-2 animate-pulse">กำลังบันทึก...</span>}
        </div>
    );
}
