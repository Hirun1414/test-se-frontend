'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidateTag } from "next/cache";

export async function submitRating(hotelId: string, score: number) {
    const session = await getServerSession(authOptions);
    if (!session) return false;

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    try {
        const res = await fetch(`${backendUrl}/api/v1/hotels/${hotelId}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({ score }),
        });

        if (!res.ok) {
            console.error('Failed to submit rating:', await res.text());
            return false;
        }

        revalidateTag('hotels'); // If we have a cache tag for hotels
        return true;
    } catch (err) {
        console.error('Submit rating error:', err);
        return false;
    }
}
