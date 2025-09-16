import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        progress: true,
        chapter: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const completed = lesson.progress.some(p => p.completed)

    return NextResponse.json({ ...lesson, completed })
  } catch (error) {
    console.error(`Error fetching lesson ${params.lessonId}:`, error)
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const body = await request.json()
    const { title, content, videoUrl, order } = body

    const data: { title?: string; content?: string; videoUrl?: string; order?: number } = {}
    if (title) data.title = title
    if (content) data.content = content
    if (videoUrl) data.videoUrl = videoUrl
    if (order) data.order = order

    const lesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data,
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error(`Error updating lesson ${params.lessonId}:`, error)
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    await prisma.lesson.delete({
      where: { id: params.lessonId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting lesson ${params.lessonId}:`, error)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}
