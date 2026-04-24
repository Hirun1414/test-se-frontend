import { NextRequest, NextResponse } from 'next/server';

const base = () => (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetch(`${base()}/api/v1/hotels/${id}`, { cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const response = await fetch(`${base()}/api/v1/hotels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}