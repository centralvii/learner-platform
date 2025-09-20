
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.IONET_API_KEY;
    if (!apiKey) {
      return new NextResponse('Missing IONET_API_KEY', { status: 500 });
    }

    const response = await fetch('https://api.intelligence.io.solutions/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(`Error from io.net API: ${errorText}`, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.data);

  } catch (error) {
    console.error('[MODELS_API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
