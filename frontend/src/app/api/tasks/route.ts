import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  return authHeader ? { Authorization: authHeader } : {};
}

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthHeader(request);
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthHeader(request);
    const body = await request.json();
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to create task' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
