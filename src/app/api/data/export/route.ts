
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                progress: true,
                notes: true,
                bookmarks: true,
              },
            },
          },
        },
      },
    });

    const exportData = {
      courses,
      // Мы можем добавить другие данные для экспорта здесь, если это необходимо
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="vibe_learn_export_${new Date().toISOString()}.json"`,
      },
    });

  } catch (error) {
    console.error('[DATA_EXPORT_API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
