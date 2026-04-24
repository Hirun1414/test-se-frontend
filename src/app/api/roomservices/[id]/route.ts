import { NextRequest, NextResponse } from 'next/server';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = `${base()}/api/v1/roomservices/${id}`;
  console.log('🔍 Fetching:', url);   // ดู log ใน terminal Next.js

  const response = await fetch(url);
  console.log('📦 Status:', response.status);

  const data = await response.json().catch(() => ({}));
  console.log('📄 Data:', data);

  return NextResponse.json(data, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const url = `${base()}/api/v1/roomservices/${id}`;
  console.log('✏️ Updating:', url);

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = `${base()}/api/v1/roomservices/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}