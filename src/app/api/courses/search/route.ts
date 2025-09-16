import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ courses: [], lessons: [] })
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
      }
    })

    const lessons = await prisma.lesson.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                {
                    content: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        select: {
            id: true,
            title: true,
            content: true,
            chapter: {
                select: {
                    courseId: true,
                }
            }
        }
    })

    const formattedCourses = courses.map(course => ({
        ...course,
        description: course.description ? course.description.substring(0, 100) + '...' : '',
        type: 'course'
      }))

    const formattedLessons = lessons.map(lesson => ({
        ...lesson,
        content: lesson.content ? lesson.content.substring(0, 100) + '...' : '',
        type: 'lesson'
    }))

    return NextResponse.json({ courses: formattedCourses, lessons: formattedLessons })
  } catch (error) {
    console.error('Error searching courses and lessons:', error)
    return NextResponse.json({ error: 'Failed to search courses and lessons' }, { status: 500 })
  }
}
