import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sandbox/tasks/[taskId]
export async function GET(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params
    const task = await prisma.sandboxTask.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error(`Error fetching sandbox task`, error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PUT /api/sandbox/tasks/[taskId]
export async function PUT(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params
    const body = await request.json()
    const { title, description, language, initialCode, solution, difficulty, tags } = body

    const data: { [key: string]: any } = {}
    if (title) data.title = title
    if (description) data.description = description
    if (language) data.language = language
    if (initialCode) data.initialCode = initialCode
    if (solution) data.solution = solution
    if (difficulty) data.difficulty = difficulty
    if (tags) data.tags = tags

    const task = await prisma.sandboxTask.update({
      where: { id: taskId },
      data,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error(`Error updating sandbox task`, error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/sandbox/tasks/[taskId]
export async function DELETE(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params
    await prisma.sandboxTask.delete({
      where: { id: taskId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting sandbox task`, error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}