import { NextRequest, NextResponse } from 'next/server';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function GET(_req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
    const { hotelId } = await params;

    const response = await fetch(`${base()}/api/v1/roomservices/hotel/${hotelId}`);
    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
}
