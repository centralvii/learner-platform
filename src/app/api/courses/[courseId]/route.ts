import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
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
    console.error(`Error fetching course ${params.courseId}:`, error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const body = await request.json()
    const { title, description, tags } = body

    const data: { title?: string; description?: string; tags?: string[] } = {}
    if (title) data.title = title
    if (description) data.description = description
    if (tags) data.tags = tags

    const course = await prisma.course.update({
      where: { id: params.courseId },
      data,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error(`Error updating course ${params.courseId}:`, error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { courseId: string } }) {
  try {
    await prisma.course.delete({
      where: { id: params.courseId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting course ${params.courseId}:`, error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
