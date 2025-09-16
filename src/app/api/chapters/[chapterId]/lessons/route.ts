import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    const body = await request.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const lastLesson = await prisma.lesson.findFirst({
        where: { chapterId: params.chapterId },
        orderBy: { order: 'desc' },
    });

    const newOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        chapterId: params.chapterId,
        order: newOrder,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error(`Error creating lesson for chapter ${params.chapterId}:`, error)
    return NextResponse.json({ error: 'Failed to create lesson', details: error.message }, { status: 500 })
  }
}
