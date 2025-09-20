import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const body = await request.json()
    const { title, order } = body

    const data: { title?: string; order?: number } = {}
    if (title) data.title = title
    if (order) data.order = order

    const chapter = await prisma.chapter.update({
      where: { id: chapterId },
      data,
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error(`Error updating chapter`, error)
    return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    await prisma.chapter.delete({
      where: { id: chapterId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting chapter`, error)
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 })
  }
}
