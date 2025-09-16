import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function executeQuery(query: string) {
    try {
        const result = await prisma.$queryRawUnsafe(query);
        return { result };
    } catch (error) {
        return { error: error.message };
    }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const { result, error } = await executeQuery(code);

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error(`Error executing query:`, error)
    return NextResponse.json({ error: 'Failed to execute query' }, { status: 500 })
  }
}
