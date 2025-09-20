'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, Save, XCircle, Trash2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Note {
  id: string;
  content: string;
  lesson: {
    id: string;
    title: string;
  };
}

interface CourseNotesSidebarProps {
  courseId: string;
  onClose: () => void;
}

export function CourseNotesSidebar({ courseId, onClose }: CourseNotesSidebarProps) {
  const params = useParams();
  const currentLessonId = params.lessonId as string;

  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNoteId, setEditingNoteId] = useState<string | null | undefined>(undefined); // undefined: list, null: new, string: edit
  const [noteContent, setNoteContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchNotes = () => {
    if (courseId) {
      setLoading(true)
      fetch(`/api/notes?courseId=${courseId}`)
        .then(res => res.json())
        .then(data => {
          setNotes(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching notes:', err)
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [courseId, editingNoteId]) // Re-fetch when a note is saved/cancelled

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (editingNoteId === null) { // Add new note
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: currentLessonId, content: noteContent }),
        })
      } else if (editingNoteId) { // Edit existing note
        await fetch(`/api/notes/${editingNoteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: noteContent }),
        })
      }
      setEditingNoteId(undefined) // Go back to list view
      setNoteContent('')
      fetchNotes() // Re-fetch notes to update list
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (noteId: string) => {
    try {
      await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })
      fetchNotes() // Re-fetch notes to update list
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleCancel = () => {
    setEditingNoteId(undefined)
    setNoteContent('')
  }

  if (editingNoteId !== undefined) {
    return (
      <div className="flex flex-col h-full bg-background border-l">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">{editingNoteId === null ? 'Новая заметка' : 'Редактировать заметку'}</h3>
          <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isSaving}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 p-4">
          <Textarea
            placeholder="Введите текст заметки..."
            className="w-full h-full resize-none focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !noteContent.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Заметки по курсу</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p>Загрузка заметок...</p>
        ) : notes.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center mt-8">Заметок по этому курсу пока нет.</p>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className="block p-3 rounded-md border hover:bg-accent transition-colors flex justify-between items-center"
            >
              <Link 
                href={`/courses/${courseId}/lessons/${note.lesson.id}`}
                className="flex-1 mr-4"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  setEditingNoteId(note.id);
                  setNoteContent(note.content);
                }}
              >
                <p className="text-sm font-medium line-clamp-2">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">Урок: {note.lesson.title}</p>
              </Link>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Вы уверены, что хотите удалить эту заметку?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие нельзя отменить. Заметка будет безвозвратно удалена.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(note.id)}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t mt-auto">
        <Button className="w-full" onClick={() => { setEditingNoteId(null); setNoteContent(''); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить заметку
        </Button>
      </div>
    </div>
  )
}