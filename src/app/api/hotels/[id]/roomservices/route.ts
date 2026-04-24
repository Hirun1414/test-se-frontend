import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: hotelId } = await params;
  const body = await req.json();

  // Get the backend JWT token from the NextAuth session
  const sessionToken = await getToken({ req });
  const backendToken = (sessionToken as any)?.token;

  if (!backendToken) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  const response = await fetch(`${base()}/api/v1/hotels/${hotelId}/roomservices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${backendToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
