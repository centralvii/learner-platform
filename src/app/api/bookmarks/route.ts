import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formatted = bookmarks.map(b => ({
      id: b.id,
      title: b.title,
      createdAt: b.createdAt,
      lessonTitle: b.lesson.title,
      courseTitle: b.lesson.chapter.course.title
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, title } = body

    if (!lessonId || !title) {
      return NextResponse.json({ error: 'lessonId and title are required' }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        lessonId,
        title
      }
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 })
  }
}
