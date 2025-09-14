import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                progress: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Подсчитываем статистику для каждого курса
    const coursesWithStats = courses.map(course => {
      const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)
      const completedLessons = course.chapters.reduce((sum, chapter) => 
        sum + chapter.lessons.filter(lesson => lesson.progress.some(p => p.completed)).length, 0
      )
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        tags: course.tags,
        createdAt: course.createdAt,
        chaptersCount: course.chapters.length,
        lessonsCount: totalLessons,
        progress
      }
    })

    return NextResponse.json(coursesWithStats)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, tags } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        tags: tags || []
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
