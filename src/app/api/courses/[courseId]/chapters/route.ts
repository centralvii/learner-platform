import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const body = await request.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get the highest order number for existing chapters in the course
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastChapter ? lastChapter.order + 1 : 1;

    const chapter = await prisma.chapter.create({
      data: {
        title,
        courseId,
        order: newOrder,
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error(`Error creating chapter for course`, error)
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 })
  }
}
