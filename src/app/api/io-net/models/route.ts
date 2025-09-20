import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const ionetApiKey = process.env.IO_NET_API_KEY;

    if (!ionetApiKey) {
      return NextResponse.json({ error: 'io.net API key not configured.' }, { status: 500 });
    }

    const response = await fetch('https://api.intelligence.io.solutions/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ionetApiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('io.net models API error:', errorData);
      return NextResponse.json({ error: errorData.error.message || 'Failed to fetch models from io.net.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.data, { status: 200 });

  } catch (error) {
    console.error('Error in io.net models API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
