'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism-coy.css'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ArrowLeft, Play } from 'lucide-react'
import { ResultTable } from '@/components/sandbox/result-table'

interface SandboxTask {
  id: string;
  title: string;
  description: string;
  language: string;
  initialCode: string | null;
}

interface ExecutionResult {
    result?: any;
    error?: string;
}

interface SubmissionResult extends ExecutionResult {
    isCorrect: boolean;
}

export default function SandboxTaskPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.taskId as string
  const [task, setTask] = useState<SandboxTask | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    if (taskId) {
      fetch(`/api/sandbox/tasks/${taskId}`)
        .then(res => res.json())
        .then(data => {
          setTask(data)
          setCode(data.initialCode || '')
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching task:', err)
          setLoading(false)
        })
    }
  }, [taskId])

  const handleExecute = async () => {
    setExecuting(true)
    setExecutionResult(null)
    setSubmissionResult(null) // Clear submission result
    try {
      const response = await fetch(`/api/sandbox/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await response.json();
      setExecutionResult(data);
    } catch (error) {
      console.error('Error executing code:', error)
      setExecutionResult({ error: 'Failed to execute code' })
    } finally {
      setExecuting(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setExecutionResult(null) // Clear execution result
    setSubmissionResult(null)
    try {
      const response = await fetch(`/api/sandbox/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await response.json();
      setSubmissionResult(data);
    } catch (error) {
      console.error('Error submitting solution:', error)
      setSubmissionResult({ isCorrect: false, result: null, error: 'Failed to submit solution' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Загрузка задачи...</div>
  }

  if (!task) {
    return <div className="p-6">Задача не найдена.</div>
  }

  return (
    <div className="h-screen bg-white text-black flex flex-col">
        <header className="flex items-center justify-between p-2 border-b border-gray-200">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/sandbox')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold">{task.title}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleExecute} disabled={executing || submitting} variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    {executing ? 'Выполнение...' : 'Выполнить'}
                </Button>
                <Button onClick={handleSubmit} disabled={executing || submitting}>
                    {submitting ? 'Отправка...' : 'Отправить'}
                </Button>
            </div>
        </header>
        <ResizablePanelGroup direction="vertical" className="flex-grow">
            <ResizablePanel>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={35} className="p-4 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">Задание</h2>
                        <div className="text-muted-foreground flex-grow overflow-y-auto">{task.description}</div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={65}>
                        <Editor
                            value={code}
                            onValueChange={code => setCode(code)}
                            highlight={code => highlight(code, languages.sql, 'sql')}
                            padding={10}
                            className="bg-gray-50 h-full"
                            style={{
                                fontFamily: '"Fira Code", "Fira Mono", monospace',
                                fontSize: 14,
                            }}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} className="p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-2">Результат</h2>
                {submissionResult ? (
                    <div className={`p-4 rounded-md ${submissionResult.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <h3 className={`font-bold ${submissionResult.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {submissionResult.isCorrect ? 'Правильное решение!' : 'Неправильное решение'}
                        </h3>
                        {submissionResult.error && <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{submissionResult.error}</pre>}
                        {submissionResult.result && <ResultTable data={submissionResult.result} />}
                    </div>
                ) : executionResult ? (
                    <div>
                        {executionResult.error && <pre className="text-sm text-red-700 whitespace-pre-wrap">{executionResult.error}</pre>}
                        {executionResult.result && <ResultTable data={executionResult.result} />}
                    </div>
                ) : (
                    <div className="text-muted-foreground">Здесь будет результат вашего запроса</div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

