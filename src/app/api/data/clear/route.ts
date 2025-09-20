
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Удаляем в порядке, чтобы избежать нарушения ограничений внешнего ключа
    await prisma.note.deleteMany({});
    await prisma.bookmark.deleteMany({});
    await prisma.progress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.chapter.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.sandboxSubmission.deleteMany({});
    await prisma.sandboxTask.deleteMany({});

    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error) {
    console.error('[DATA_CLEAR_API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
