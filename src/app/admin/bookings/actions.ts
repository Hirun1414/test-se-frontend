'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

export async function deleteBookingAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.user.token}` },
    });

    if (!res.ok) throw new Error('Failed to delete booking');
    revalidatePath('/admin/bookings');
}

export async function updateBookingAction(id: string, apptDate: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, message: 'Unauthorized' };

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ apptDate }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return { success: false, message: errorData?.message || 'Failed to update booking' };
    }
    revalidatePath('/admin/bookings');
    return { success: true };
}
