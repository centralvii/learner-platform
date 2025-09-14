"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  ArrowRight, 
  CheckCircle, 
  Circle,
  Bookmark,
  BookmarkCheck,
  FileText,
  Plus,
  Play,
  Clock,
  Edit,
  Trash2
} from "lucide-react"

interface LessonData {
  id: string
  title: string
  content: string
  videoUrl: string | null
  attachments: string[]
  order: number
  completed: boolean
  chapter: {
    id: string
    title: string
    course: {
      id: string
      title: string
    }
  }
  notes: {
    id: string
    content: string
    createdAt: string
    updatedAt: string
  }[]
  bookmarks: {
    id: string
    title: string
    createdAt: string
  }[]
}

export default function LessonPage({ params }: { 
  params: { courseId: string; lessonId: string } 
}) {
  const router = useRouter()
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editingNoteContent, setEditingNoteContent] = useState("")

  useEffect(() => {
    fetch(`/api/courses/${params.courseId}/lessons/${params.lessonId}`)
      .then(res => res.json())
      .then(data => {
        setLesson(data)
        setIsCompleted(data.completed)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching lesson:', err)
        setLoading(false)
      })
  }, [params.courseId, params.lessonId])

  const handleCompleteLesson = async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonId: params.lessonId, 
          completed: !isCompleted 
        })
      })
      setIsCompleted(!isCompleted)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleAddNote = async () => {
    if (newNote.trim() && lesson) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lessonId: lesson.id, 
            content: newNote.trim() 
          })
        })
        
        if (response.ok) {
          const newNoteData = await response.json()
          setLesson(prev => prev ? {
            ...prev,
            notes: [...prev.notes, {
              id: newNoteData.id,
              content: newNoteData.content,
              createdAt: newNoteData.createdAt,
              updatedAt: newNoteData.updatedAt
            }]
          } : null)
          setNewNote("")
        }
      } catch (error) {
        console.error('Error adding note:', error)
      }
    }
  }

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNote(noteId)
    setEditingNoteContent(content)
  }

  const handleSaveNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingNoteContent })
      })
      
      if (response.ok) {
        const updatedNote = await response.json()
        setLesson(prev => prev ? {
          ...prev,
          notes: prev.notes.map(note => 
            note.id === noteId 
              ? { ...note, content: editingNoteContent, updatedAt: updatedNote.updatedAt }
              : note
          )
        } : null)
        setEditingNote(null)
        setEditingNoteContent("")
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setLesson(prev => prev ? {
          ...prev,
          notes: prev.notes.filter(note => note.id !== noteId)
        } : null)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleAddBookmark = async () => {
    if (newBookmarkTitle.trim() && lesson) {
      try {
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lessonId: lesson.id, 
            title: newBookmarkTitle.trim() 
          })
        })
        
        if (response.ok) {
          const newBookmark = await response.json()
          setLesson(prev => prev ? {
            ...prev,
            bookmarks: [...prev.bookmarks, {
              id: newBookmark.id,
              title: newBookmark.title,
              createdAt: newBookmark.createdAt
            }]
          } : null)
          setNewBookmarkTitle("")
        }
      } catch (error) {
        console.error('Error adding bookmark:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Урок не найден
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Урок с данным идентификатором не существует
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Хедер урока */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад к курсу
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {lesson.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {lesson.chapter.course.title} • {lesson.chapter.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={lesson.bookmarks.length > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setNewBookmarkTitle(lesson.title)}
                className="flex items-center gap-2"
              >
                {lesson.bookmarks.length > 0 ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {lesson.bookmarks.length > 0 ? "В закладках" : "Добавить в закладки"}
              </Button>
              <Button
                variant={isCompleted ? "default" : "outline"}
                size="sm"
                onClick={handleCompleteLesson}
                className="flex items-center gap-2"
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                {isCompleted ? "Завершено" : "Отметить завершенным"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            {/* Видео плеер (если есть видео) */}
            {lesson.videoUrl && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Play className="h-16 w-16 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Видео-лекция будет здесь
                      </p>
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        Воспроизвести
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Текстовый контент */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Материалы урока
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{lesson.content}</div>
                </div>
              </CardContent>
            </Card>

            {/* Вложения */}
            {lesson.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Дополнительные материалы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lesson.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{attachment}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Скачать
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Навигация */}
            <div className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Предыдущий урок
              </Button>
              <Button className="flex items-center gap-2">
                Следующий урок
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Прогресс */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Прогресс урока</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Статус:</span>
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Завершено" : "В процессе"}
                    </Badge>
                  </div>
                  <Progress value={isCompleted ? 100 : 50} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {isCompleted ? "Урок завершен!" : "Продолжите изучение"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Закладки */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Закладки ({bookmarks.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Название закладки"
                      value={newBookmarkTitle}
                      onChange={(e) => setNewBookmarkTitle(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={handleAddBookmark}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {bookmarks.map(bookmark => (
                      <div key={bookmark.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        <p className="font-medium">{bookmark.title}</p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {bookmark.createdAt.toLocaleString('ru-RU')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Заметки */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Мои заметки ({notes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Добавить заметку к уроку..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="text-sm"
                      rows={3}
                    />
                    <Button size="sm" onClick={handleAddNote} className="w-full">
                      <Plus className="h-3 w-3 mr-2" />
                      Добавить заметку
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notes.map(note => (
                      <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        {editingNote === note.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingNoteContent}
                              onChange={(e) => setEditingNoteContent(e.target.value)}
                              className="text-xs"
                              rows={2}
                            />
                            <div className="flex gap-1">
                              <Button size="sm" onClick={() => handleSaveNote(note.id)}>
                                Сохранить
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingNote(null)}
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mb-2">{note.content}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {note.updatedAt.toLocaleString('ru-RU')}
                              </p>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditNote(note.id, note.content)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteNote(note.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
