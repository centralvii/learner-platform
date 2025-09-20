import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function executeQuery(query: string) {
    try {
        const result = await prisma.$queryRawUnsafe(query);
        return { result };
    } catch (error) {
        return { error: error.message };
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params;
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const task = await prisma.sandboxTask.findUnique({ where: { id: taskId } });
    if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { result: userResult, error: userError } = await executeQuery(code);
    if (userError) {
        return NextResponse.json({ error: userError }, { status: 400 });
    }

    const { result: solutionResult, error: solutionError } = await executeQuery(task.solution);
    if (solutionError) {
        // This should not happen if the solution in the DB is correct
        return NextResponse.json({ error: 'Error in task solution' }, { status: 500 });
    }

    const isCorrect = JSON.stringify(userResult) === JSON.stringify(solutionResult);

    await prisma.sandboxSubmission.create({
        data: {
            taskId: taskId,
            code,
            isCorrect,
        }
    });

    return NextResponse.json({ isCorrect, result: userResult });

  } catch (error) {
    console.error(`Error submitting solution for task`, error)
    return NextResponse.json({ error: 'Failed to submit solution' }, { status: 500 })
  }
}
