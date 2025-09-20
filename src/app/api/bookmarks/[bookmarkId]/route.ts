import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: Request, { params }: { params: { bookmarkId: string } }) {
  try {
    await prisma.bookmark.delete({
      where: { id: params.bookmarkId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting bookmark ${params.bookmarkId}:`, error)
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 })
  }
}