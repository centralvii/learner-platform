'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'
import { NoteSection } from '@/components/lessons/note-section'
import { BookmarkSection } from '@/components/lessons/bookmark-section'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useCourse } from '@/contexts/course-context'
import { SelectionMenu } from '@/components/selection-menu'
import { AddNoteDialog } from '@/components/lessons/add-note-dialog'
import { AddBookmarkDialog } from '@/components/lessons/add-bookmark-dialog'

interface Lesson {
  id: string
  title: string
  content: string | null
  videoUrl: string | null
  completed: boolean
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.lessonId as string
  const { updateLessonCompletion } = useCourse()
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showAddBookmarkDialog, setShowAddBookmarkDialog] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const fetchLesson = () => {
    if (lessonId) {
      setLoading(true)
      fetch(`/api/lessons/${lessonId}`)
        .then(res => res.json())
        .then(data => {
          setLesson(data)
        })
        .catch(err => console.error('Error fetching lesson:', err))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const handleToggleComplete = async () => {
    if (!lesson) return

    const newCompletedStatus = !lesson.completed

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonId: lesson.id, 
          completed: newCompletedStatus 
        }),
      })
      // Optimistically update the lesson page UI
      setLesson({ ...lesson, completed: newCompletedStatus })
      // Update the sidebar UI via context
      updateLessonCompletion(lesson.id, newCompletedStatus)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleAddNote = (content: string) => {
    setSelectedText(content);
    setShowAddNoteDialog(true);
  }

  const handleAddBookmark = (title: string) => {
    setSelectedText(title);
    setShowAddBookmarkDialog(true);
  }

  const saveNote = async (content: string) => {
    await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, content }),
    });
  }

  const saveBookmark = async (title: string) => {
    await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, title }),
    });
  }

  if (loading || !lesson) {
    return (
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-lg h-64"></div>
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="p-6">
        <SelectionMenu onAddNote={handleAddNote} onAddBookmark={handleAddBookmark} />
        <AddNoteDialog 
            isOpen={showAddNoteDialog} 
            onOpenChange={setShowAddNoteDialog} 
            initialContent={selectedText} 
            onSave={saveNote} 
        />
        <AddBookmarkDialog 
            isOpen={showAddBookmarkDialog} 
            onOpenChange={setShowAddBookmarkDialog} 
            initialTitle={selectedText} 
            onSave={saveBookmark} 
        />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <Button onClick={handleToggleComplete} variant={lesson.completed ? 'secondary' : 'default'}>
            {lesson.completed ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Завершено</>
            ) : (
              <><Circle className="mr-2 h-4 w-4" /> Отметить как пройдено</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Материалы урока</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                {lesson.videoUrl && (
                  <div className="aspect-video mb-6">
                    <iframe 
                      className="w-full h-full rounded-lg"
                      src={lesson.videoUrl} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                {lesson.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
                ) : (
                  <p>Содержимое урока отсутствует.</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <NoteSection lessonId={lessonId} />
            <div className="mt-6">
              <BookmarkSection lessonId={lessonId} />
            </div>
          </div>
        </div>
      </div>
  )
}