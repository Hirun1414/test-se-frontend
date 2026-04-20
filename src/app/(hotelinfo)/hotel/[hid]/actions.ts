'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

export async function submitReview(hotelId: string, score: number, comment: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนรีวิว' };

    try {
        const res = await fetch(`${backendUrl}/api/v1/hotels/${hotelId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({ score, comment }),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.message || 'ไม่สามารถส่งรีวิวได้' };
        }

        revalidatePath(`/hotel/${hotelId}`);
        return { success: true };
    } catch (err) {
        console.error('Submit review error:', err);
        return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
}

export async function updateReview(hotelId: string, reviewId: string, score: number, comment: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: 'กรุณาเข้าสู่ระบบ' };

    try {
        const res = await fetch(`${backendUrl}/api/v1/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({ score, comment }),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.message || 'ไม่สามารถแก้ไขรีวิวได้' };
        }

        revalidatePath(`/hotel/${hotelId}`);
        return { success: true };
    } catch (err) {
        console.error('Update review error:', err);
        return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
}

export async function deleteReview(hotelId: string, reviewId: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: 'กรุณาเข้าสู่ระบบ' };

    try {
        const res = await fetch(`${backendUrl}/api/v1/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${session.user.token}` },
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.message || 'ไม่สามารถลบรีวิวได้' };
        }

        revalidatePath(`/hotel/${hotelId}`);
        return { success: true };
    } catch (err) {
        console.error('Delete review error:', err);
        return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
}

export async function voteReview(
    hotelId: string,
    reviewId: string,
    action: 'like' | 'dislike'
): Promise<{ success: boolean; likes?: string[]; dislikes?: string[]; message?: string }> {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: 'กรุณาเข้าสู่ระบบก่อน' };

    try {
        const res = await fetch(`${backendUrl}/api/v1/reviews/${reviewId}/like`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({ action }),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.message || 'ไม่สามารถโหวตได้' };
        }

        revalidatePath(`/hotel/${hotelId}`);
        return { success: true, likes: data.data.likes, dislikes: data.data.dislikes };
    } catch (err) {
        console.error('Vote review error:', err);
        return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
}
