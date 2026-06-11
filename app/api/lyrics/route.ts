import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Gunakan standar modern WHATWG URL API
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://lrclib.org/api/get?artist=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`
    );
    
    if (!response.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}