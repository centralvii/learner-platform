import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tasks = await prisma.sandboxTask.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        submissions: true, // Include submissions to determine status
      },
    })

    const tasksWithStatus = tasks.map(task => {
        const isSolved = task.submissions.some(s => s.isCorrect);
        const hasSubmissions = task.submissions.length > 0;
        let status = 'not-started';
        if (isSolved) {
            status = 'solved';
        } else if (hasSubmissions) {
            status = 'attempted';
        }

        return { ...task, status };
    })

    return NextResponse.json(tasksWithStatus)
  } catch (error) {
    console.error('Error fetching sandbox tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch sandbox tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, language, initialCode, solution, difficulty, tags } = body

    if (!title || !description || !language || !solution || !difficulty || !tags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const task = await prisma.sandboxTask.create({
      data: {
        title,
        description,
        language,
        initialCode,
        solution,
        difficulty,
        tags,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating sandbox task:', error)
    return NextResponse.json({ error: 'Failed to create sandbox task' }, { status: 500 })
  }
}
