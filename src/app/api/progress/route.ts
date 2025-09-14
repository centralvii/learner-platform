import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, completed } = body

    if (!lessonId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'lessonId and completed status are required' }, { status: 400 })
    }

    // Проверяем, есть ли уже запись о прогрессе для этого урока
    const existingProgress = await prisma.progress.findFirst({
      where: { lessonId }
    })

    let progress
    if (existingProgress) {
      // Обновляем существующую запись
      progress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: { completed }
      })
    } else {
      // Создаем новую запись
      progress = await prisma.progress.create({
        data: {
          lessonId,
          completed
        }
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Получаем общую статистику прогресса
    const totalLessons = await prisma.lesson.count()
    const completedLessons = await prisma.progress.count({
      where: { completed: true }
    })
    
    const totalCourses = await prisma.course.count()
    const totalNotes = await prisma.note.count()
    const totalBookmarks = await prisma.bookmark.count()

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return NextResponse.json({
      totalCourses,
      totalLessons,
      completedLessons,
      totalNotes,
      totalBookmarks,
      progressPercentage
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
