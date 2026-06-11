import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return NextResponse.json({ error: 'Missing title or artist' }, { status: 400 });
  }

  try {
    // Tembak langsung ke server LRCLIB menggunakan data judul dan artis dari Player.tsx
    const response = await fetch(
      `https://lrclib.org/api/get?artist=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`,
      {
        headers: {
          'User-Agent': 'MusicAppByRaizel (contact: github/raizel)'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Lyrics not found on LRCLIB' }, { status: 404 });
    }

    const data = await response.json();

    // Jika lirik tersinkronisasi (Format LRC) ditemukan
    if (data.syncedLyrics) {
      const lines = data.syncedLyrics.split('\n').map((line: string) => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseFloat(match[2]);
          const time = minutes * 60 + seconds;
          const text = match[3].trim();
          return { time, text };
        }
        return null;
      }).filter(Boolean);

      return NextResponse.json({
        lyrics: {
          type: 'synced',
          lines: lines
        }
      });
    } 
    
    // Jika hanya ada lirik biasa tanpa penanda waktu
    if (data.plainLyrics) {
      const lines = data.plainLyrics.split('\n').map((line: string) => ({ text: line.trim() }));
      return NextResponse.json({
        lyrics: {
          type: 'plain',
          lines: lines
        }
      });
    }

    return NextResponse.json({ error: 'No usable lyrics format' }, { status: 404 });

  } catch (error) {
    console.error('Error fetching lyrics from LRCLIB:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}