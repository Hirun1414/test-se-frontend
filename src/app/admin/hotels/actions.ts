'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API = (process.env.BACKEND_URL ?? '').replace(/\/$/, '');

type HotelFormData = {
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    region: string;
    picture: string;
    dailyrate: number;
};

export async function deleteHotelAction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const res = await fetch(`${API}/api/v1/hotels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.user.token}` },
    });

    if (!res.ok) throw new Error('Failed to delete hotel');
    revalidatePath('/admin/hotels');
}

export async function createHotelAction(data: HotelFormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const body = { ...data };
    if (!body.region) delete (body as Partial<HotelFormData>).region;

    const res = await fetch(`${API}/api/v1/hotels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? 'Failed to create hotel');
    }

    redirect('/admin/hotels');
}

export async function updateHotelAction(id: string, data: HotelFormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const body = { ...data };
    if (!body.region) delete (body as Partial<HotelFormData>).region;

    const res = await fetch(`${API}/api/v1/hotels/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[updateHotel]', res.status, JSON.stringify(err));
        throw new Error(err.message ?? `Failed to update hotel (${res.status})`);
    }

    redirect('/admin/hotels');
}
