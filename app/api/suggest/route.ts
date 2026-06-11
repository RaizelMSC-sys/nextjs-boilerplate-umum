import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    // Menggunakan client=firefox agar Google membalas dengan format Array JSON yang murni dan tidak memicu error parsing
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const data = await response.json();
    
    // Format balasan client=firefox adalah: ["keyword", ["saran1", "saran2", "saran3"]]
    if (Array.isArray(data) && Array.isArray(data[1])) {
      return NextResponse.json(data[1]);
    }

    return NextResponse.json([]);
  } catch (error) {
    // Jika masih gagal, kita tangkap error-nya agar tidak melempar 500 ke layar depan
    console.error('Error saat mengambil saran Google:', error);
    return NextResponse.json([]);
  }
}