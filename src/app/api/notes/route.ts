import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const notesWithCourseInfo = notes.map(note => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      lessonTitle: note.lesson.title,
      courseTitle: note.lesson.chapter.course.title
    }))

    return NextResponse.json(notesWithCourseInfo)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, content } = body

    if (!lessonId || !content) {
      return NextResponse.json({ error: 'lessonId and content are required' }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        lessonId,
        content
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
