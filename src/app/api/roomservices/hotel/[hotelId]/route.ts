import { NextRequest, NextResponse } from 'next/server';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function GET(_req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
    try {
        const { hotelId } = await params;

        const response = await fetch(`${base()}/api/v1/roomservices/hotel/${hotelId}`);
        const data = await response.json().catch(() => ({}));

        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error("Fetch error in roomservices/hotel API:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error or timeout", error: error.message }, 
            { status: 500 }
        );
    }
}
