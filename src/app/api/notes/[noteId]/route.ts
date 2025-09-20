import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: Request, { params }: { params: { noteId: string } }) {
  try {
    await prisma.note.delete({
      where: { id: params.noteId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting note ${params.noteId}:`, error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}