import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  try {
    const task = await prisma.sandboxTask.findUnique({
      where: { id: params.taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error(`Error fetching sandbox task ${params.taskId}:`, error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { taskId: string } }) {
  try {
    const body = await request.json()
    const { title, description, language, initialCode, solution } = body

    const data: { [key: string]: any } = {}
    if (title) data.title = title
    if (description) data.description = description
    if (language) data.language = language
    if (initialCode) data.initialCode = initialCode
    if (solution) data.solution = solution

    const task = await prisma.sandboxTask.update({
      where: { id: params.taskId },
      data,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error(`Error updating sandbox task ${params.taskId}:`, error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { taskId: string } }) {
  try {
    await prisma.sandboxTask.delete({
      where: { id: params.taskId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting sandbox task ${params.taskId}:`, error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
