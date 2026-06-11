import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json([]);

  try {
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data[1] : []);
  } catch (err) {
    return NextResponse.json([]);
  }
}