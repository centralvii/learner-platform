import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const body = await request.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const lastLesson = await prisma.lesson.findFirst({
        where: { chapterId },
        orderBy: { order: 'desc' },
    });

    const newOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        chapterId,
        order: newOrder,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error(`Error creating lesson for chapter`, error)
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}

