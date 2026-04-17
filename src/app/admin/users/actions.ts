'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

export async function toggleBanAction(id: string, isban: boolean) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'PomPhet') throw new Error('Unauthorized');

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ isban }),
    });

    if (!res.ok) throw new Error('Failed to update user');
    revalidatePath('/admin/users');
}

export async function deleteUserAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'PomPhet') throw new Error('Unauthorized');

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.user.token}` },
    });

    if (!res.ok) throw new Error('Failed to delete user');
    revalidatePath('/admin/users');
}
