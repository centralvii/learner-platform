import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                progress: true,
                notes: true,
                bookmarks: true
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Добавляем статистику прогресса
    const chaptersWithProgress = course.chapters.map(chapter => {
      const lessonsWithProgress = chapter.lessons.map(lesson => ({
        ...lesson,
        completed: lesson.progress.some(p => p.completed)
      }))

      return {
        ...chapter,
        lessons: lessonsWithProgress
      }
    })

    return NextResponse.json({
      ...course,
      chapters: chaptersWithProgress
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params
    const body = await request.json()
    const { title, description, tags } = body

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        tags
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    await prisma.course.delete({
      where: { id: courseId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
