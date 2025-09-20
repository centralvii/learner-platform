
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.courses || !Array.isArray(data.courses)) {
      return new NextResponse('Invalid data format: courses array is missing', { status: 400 });
    }

    // Очищаем старые данные перед импортом
    await prisma.note.deleteMany({});
    await prisma.bookmark.deleteMany({});
    await prisma.progress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.chapter.deleteMany({});
    await prisma.course.deleteMany({});

    // Импортируем новые данные
    for (const course of data.courses) {
      const { chapters, ...courseData } = course;
      const newCourse = await prisma.course.create({
        data: { ...courseData, id: undefined }, // Позволяем Prisma генерировать новый ID
      });

      if (chapters && Array.isArray(chapters)) {
        for (const chapter of chapters) {
          const { lessons, ...chapterData } = chapter;
          const newChapter = await prisma.chapter.create({
            data: {
              ...chapterData,
              id: undefined,
              courseId: newCourse.id,
            },
          });

          if (lessons && Array.isArray(lessons)) {
            for (const lesson of lessons) {
              const { progress, notes, bookmarks, ...lessonData } = lesson;
              const newLesson = await prisma.lesson.create({
                data: {
                  ...lessonData,
                  id: undefined,
                  chapterId: newChapter.id,
                },
              });

              // Импорт прогресса, заметок и закладок по желанию
            }
          }
        }
      }
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('[DATA_IMPORT_API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
