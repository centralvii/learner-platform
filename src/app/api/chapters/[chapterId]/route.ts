import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    const body = await request.json()
    const { title, order } = body

    const data: { title?: string; order?: number } = {}
    if (title) data.title = title
    if (order) data.order = order

    const chapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data,
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error(`Error updating chapter ${params.chapterId}:`, error)
    return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    await prisma.chapter.delete({
      where: { id: params.chapterId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting chapter ${params.chapterId}:`, error)
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 })
  }
}
