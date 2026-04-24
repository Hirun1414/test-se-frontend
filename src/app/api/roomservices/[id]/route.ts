import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = `${base()}/api/v1/roomservices/${id}`;

  const cookieHeader = _req.headers.get('cookie') || '';
  console.log('🔍 Fetching:', url);   // ดู log ใน terminal Next.js

  const response = await fetch(url, {
    headers: { 'Cookie': cookieHeader }, // ← and this
  });
  console.log('📦 Status:', response.status);

  const data = await response.json().catch(() => ({}));
  console.log('📄 Data:', data);

  return NextResponse.json(data, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const url = `${base()}/api/v1/roomservices/${id}`;

  // Get the backend JWT token from the NextAuth session
  const sessionToken = await getToken({ req });
  const backendToken = (sessionToken as any)?.token;

  if (!backendToken) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${backendToken}`, // ← your backend reads this
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = `${base()}/api/v1/roomservices/${id}`;

  // Get the backend JWT token from the NextAuth session
  const sessionToken = await getToken({ req: _req });
  const backendToken = (sessionToken as any)?.token;

  if (!backendToken) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${backendToken}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}