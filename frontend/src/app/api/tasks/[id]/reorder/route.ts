import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  return authHeader ? { Authorization: authHeader } : {};
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = getAuthHeader(request);
    const body = await request.json();
    const res = await fetch(`${API_URL}/api/tasks/${id}/reorder`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        new_column_id: body.newColumnId,
        new_order: body.newOrder,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to reorder task' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
