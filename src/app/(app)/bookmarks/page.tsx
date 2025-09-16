'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark } from 'lucide-react'

interface BookmarkItem {
  id: string
  title: string
  createdAt: string
  lessonTitle: string
  courseTitle: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        setBookmarks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching bookmarks:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Все закладки</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-28"></div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Нет закладок</h2>
          <p className="text-muted-foreground mt-2">Вы еще не создали ни одной закладки.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(bookmark => (
            <Card key={bookmark.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bookmark className="h-5 w-5 mr-2" /> 
                  {bookmark.title}
                </CardTitle>
                <CardDescription>{bookmark.lessonTitle} / {bookmark.courseTitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Создано: {new Date(bookmark.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}