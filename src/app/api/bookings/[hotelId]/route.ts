import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { hotelId } = await params;
    const body = await req.json();

    const response = await fetch(`${base()}/api/v1/hotels/${hotelId}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { hotelId } = await params;
    const body = await req.json();

    const response = await fetch(`${base()}/api/v1/bookings/${hotelId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { hotelId } = await params;

    const response = await fetch(`${base()}/api/v1/bookings/${hotelId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.user.token}` },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ success: true });
}
