"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Bookmark, 
  Trash2,
  Clock,
  BookOpen,
  Plus,
  ExternalLink
} from "lucide-react"

// Временные данные для демонстрации
const mockBookmarksData = [
  {
    id: "b1",
    title: "Важная историческая информация",
    lessonTitle: "История JavaScript",
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-20T10:45:00")
  },
  {
    id: "b2",
    title: "Ключевые особенности ES6",
    lessonTitle: "История JavaScript", 
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-20T11:20:00")
  },
  {
    id: "b3",
    title: "Операторы сравнения - важно!",
    lessonTitle: "Операторы",
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-21T14:25:00")
  },
  {
    id: "b4",
    title: "Virtual DOM концепция",
    lessonTitle: "Что такое React?",
    courseTitle: "React для начинающих",
    createdAt: new Date("2024-01-22T09:50:00")
  },
  {
    id: "b5",
    title: "Настройка VS Code",
    lessonTitle: "Настройка среды разработки",
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-19T16:30:00")
  }
]

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarks] = useState(mockBookmarksData)

  // Фильтруем закладки по поиску
  const filteredBookmarksData = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Группируем закладки по курсам
  const bookmarksByCourse = filteredBookmarksData.reduce((acc, bookmark) => {
    if (!acc[bookmark.courseTitle]) {
      acc[bookmark.courseTitle] = []
    }
    acc[bookmark.courseTitle].push(bookmark)
    return acc
  }, {} as Record<string, typeof mockBookmarksData>)

  // Сортируем закладки по дате создания (новые первыми)
  Object.keys(bookmarksByCourse).forEach(course => {
    bookmarksByCourse[course].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Мои закладки
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Быстрый доступ к важным урокам и материалам
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Bookmark className="h-3 w-3" />
          {filteredBookmarksData.length} закладок
        </Badge>
      </div>

      {/* Поиск */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск по закладкам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Закладки по курсам */}
      <div className="space-y-6">
        {Object.keys(bookmarksByCourse).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bookmark className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? "Закладки не найдены" : "Пока нет закладок"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                {searchQuery 
                  ? "Попробуйте изменить поисковый запрос" 
                  : "Добавляйте закладки к важным урокам для быстрого доступа"
                }
              </p>
              {!searchQuery && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Перейти к курсам
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          Object.entries(bookmarksByCourse).map(([courseTitle, courseBookmarks]) => (
            <Card key={courseTitle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {courseTitle}
                </CardTitle>
                <CardDescription>
                  {courseBookmarks.length} {courseBookmarks.length === 1 ? 'закладка' : 'закладок'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courseBookmarks.map(bookmark => (
                    <div 
                      key={bookmark.id} 
                      className="group flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {bookmark.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {bookmark.lessonTitle}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            Добавлена {bookmark.createdAt.toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Быстрые действия */}
      {filteredBookmarksData.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                  🔖 Быстрые действия
                </h3>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Управляйте своими закладками эффективно
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900">
                  Экспорт закладок
                </Button>
                <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900">
                  Очистить старые
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Статистика */}
      {filteredBookmarksData.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📊 Статистика закладок
              </h3>
              <div className="flex justify-center gap-6 text-xs text-blue-700 dark:text-blue-300">
                <span>Всего закладок: {bookmarks.length}</span>
                <span>Курсов с закладками: {Object.keys(bookmarksByCourse).length}</span>
                <span>Последняя закладка: {bookmarks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt.toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
