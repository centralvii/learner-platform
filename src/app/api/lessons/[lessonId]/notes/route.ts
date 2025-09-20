import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await params;
    const notes = await prisma.note.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(notes)
  } catch (error) {
    console.error(`Error fetching notes for lesson`, error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}
