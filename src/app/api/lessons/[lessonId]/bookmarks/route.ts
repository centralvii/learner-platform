import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { lessonId: params.lessonId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error(`Error fetching bookmarks for lesson ${params.lessonId}:`, error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}