'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Note {
  id: string
  content: string
  createdAt: string
}

interface NoteSectionProps {
  lessonId: string
}

export function NoteSection({ lessonId }: NoteSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchNotes = () => {
    setLoading(true)
    fetch(`/api/lessons/${lessonId}/notes`)
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

  useEffect(() => {
    fetchNotes()
  }, [lessonId])

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, content: newNote }),
      })
      setNewNote('')
      fetchNotes() // Refresh notes list
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заметки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea 
              placeholder="Напишите свою заметку здесь..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Button onClick={handleAddNote} size="sm">Добавить заметку</Button>
          </div>
          <div className="space-y-2">
            {loading ? (
              <p>Загрузка заметок...</p>
            ) : notes.length > 0 ? (
              notes.map(note => (
                <div key={note.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                  <p>{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">У вас пока нет заметок к этому уроку.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
