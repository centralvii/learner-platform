import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('courseId')

  try {
    const notes = await prisma.note.findMany({
      where: courseId ? {
        lesson: {
          chapter: {
            courseId: courseId
          }
        }
      } : {},
      include: {
        lesson: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, content } = body

    if (!lessonId || !content) {
      return NextResponse.json({ error: 'lessonId and content are required' }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        lessonId,
        content
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const urlParts = request.url.split('/');
    const noteId = urlParts[urlParts.length - 1];
    const body = await request.json();
    const { content } = body;

    if (!noteId || !content) {
      return NextResponse.json({ error: 'noteId and content are required' }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { content },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const urlParts = request.url.split('/');
    const noteId = urlParts[urlParts.length - 1];

    if (!noteId) {
      return NextResponse.json({ error: 'noteId is required' }, { status: 400 });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}