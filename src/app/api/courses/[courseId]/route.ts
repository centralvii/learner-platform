import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progress: true
              }
            }
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Calculate progress for each lesson
    const courseWithLessonProgress = {
      ...course,
      chapters: course.chapters.map(chapter => ({
        ...chapter,
        lessons: chapter.lessons.map(lesson => ({
          ...lesson,
          completed: lesson.progress.some(p => p.completed)
        }))
      }))
    }

    return NextResponse.json(courseWithLessonProgress)
  } catch (error) {
    console.error(`Error fetching course`, error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const body = await request.json()
    const { title, description, tags } = body

    const data: { title?: string; description?: string; tags?: string[] } = {}
    if (title) data.title = title
    if (description) data.description = description
    if (tags) data.tags = tags

    const course = await prisma.course.update({
      where: { id: courseId },
      data,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error(`Error updating course`, error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    await prisma.course.delete({
      where: { id: courseId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting course`, error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
