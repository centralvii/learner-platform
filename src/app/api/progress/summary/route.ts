
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalCourses = await prisma.course.count();
    const totalLessons = await prisma.lesson.count();
    const completedLessons = await prisma.progress.count({
      where: { completed: true },
    });

    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                progress: true,
              },
            },
          },
        },
      },
    });

    const courseProgress = courses.map(course => {
      const lessons = course.chapters.flatMap(c => c.lessons);
      const completed = lessons.filter(l => l.progress.some(p => p.completed)).length;
      const total = lessons.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      // Найдем последнюю активность
      const lastAccessedRecords = lessons
        .flatMap(l => l.progress)
        .filter(p => p.updatedAt)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      return {
        id: course.id,
        title: course.title,
        completed,
        total,
        progress,
        lastAccessed: lastAccessedRecords.length > 0 ? lastAccessedRecords[0].updatedAt : null,
        lastAccessedLessonId: lastAccessedRecords.length > 0 ? lastAccessedRecords[0].lessonId : null,
      };
    });

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      totalCourses,
      totalLessons,
      completedLessons,
      progressPercentage,
      courseProgress,
      // Пока что возвращаем заглушки для остального
      totalNotes: 1, 
      totalBookmarks: 0,
      totalStudyTime: 180,
      thisWeekTime: 45,
      streak: 3,
      achievements: [
        { id: 1, title: 'Первые шаги', description: 'Начал изучение первого курса', earned: true },
        { id: 2, title: 'Настойчивость', description: 'Изучал 3 дня подряд', earned: true },
        { id: 3, title: 'Знаток', description: 'Завершил первый курс', earned: false },
      ],
    });

  } catch (error) {
    console.error('[PROGRESS_SUMMARY_API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
