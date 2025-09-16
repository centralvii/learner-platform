'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Note {
  id: string
  content: string
  createdAt: string
  lessonTitle: string
  courseTitle: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching notes:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Все заметки</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-36"></div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Нет заметок</h2>
          <p className="text-muted-foreground mt-2">Вы еще не создали ни одной заметки.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle className="text-lg">{note.lessonTitle}</CardTitle>
                <CardDescription>{note.courseTitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}