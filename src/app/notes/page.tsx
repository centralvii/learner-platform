"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  FileText, 
  Edit, 
  Trash2,
  Clock,
  BookOpen,
  Plus
} from "lucide-react"

// Временные данные для демонстрации
const mockNotes = [
  {
    id: "n1",
    content: "JavaScript был создан всего за 10 дней Бренданом Эйхом. Это объясняет некоторые странности языка.",
    lessonTitle: "История JavaScript",
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-20T10:30:00"),
    updatedAt: new Date("2024-01-20T10:30:00")
  },
  {
    id: "n2",
    content: "ES6 принес много новых возможностей:\n- Стрелочные функции\n- Классы\n- Деструктуризация\n- let/const\n- Template literals",
    lessonTitle: "История JavaScript",
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-20T11:15:00"),
    updatedAt: new Date("2024-01-20T11:15:00")
  },
  {
    id: "n3",
    content: "Важно помнить о различии между == и === в JavaScript. === проверяет тип и значение, == только значение с приведением типов.",
    lessonTitle: "Операторы",
    courseTitle: "Основы JavaScript",
    createdAt: new Date("2024-01-21T14:20:00"),
    updatedAt: new Date("2024-01-21T14:22:00")
  },
  {
    id: "n4",
    content: "React использует Virtual DOM для оптимизации обновлений интерфейса. Это ключевая особенность, которая делает React быстрым.",
    lessonTitle: "Что такое React?",
    courseTitle: "React для начинающих",
    createdAt: new Date("2024-01-22T09:45:00"),
    updatedAt: new Date("2024-01-22T09:45:00")
  }
]

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notes] = useState(mockNotes)

  // Фильтруем заметки по поиску
  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Группируем заметки по курсам
  const notesByCourse = filteredNotes.reduce((acc, note) => {
    if (!acc[note.courseTitle]) {
      acc[note.courseTitle] = []
    }
    acc[note.courseTitle].push(note)
    return acc
  }, {} as Record<string, typeof mockNotes>)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Мои заметки
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Все ваши заметки к урокам в одном месте
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {filteredNotes.length} заметок
        </Badge>
      </div>

      {/* Поиск */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск по заметкам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Заметки по курсам */}
      <div className="space-y-6">
        {Object.keys(notesByCourse).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? "Заметки не найдены" : "Пока нет заметок"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                {searchQuery 
                  ? "Попробуйте изменить поисковый запрос" 
                  : "Начните изучать курсы и добавляйте заметки к урокам"
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
          Object.entries(notesByCourse).map(([courseTitle, courseNotes]) => (
            <Card key={courseTitle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {courseTitle}
                </CardTitle>
                <CardDescription>
                  {courseNotes.length} {courseNotes.length === 1 ? 'заметка' : 'заметок'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseNotes.map(note => (
                    <div key={note.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                            {note.lessonTitle}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {note.updatedAt.toLocaleDateString('ru-RU')} в {note.updatedAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {note.updatedAt > note.createdAt && (
                              <Badge variant="outline" className="text-xs py-0">
                                Изменена
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {note.content}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Статистика */}
      {filteredNotes.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📝 Статистика заметок
              </h3>
              <div className="flex justify-center gap-6 text-xs text-blue-700 dark:text-blue-300">
                <span>Всего заметок: {notes.length}</span>
                <span>Курсов с заметками: {Object.keys(notesByCourse).length}</span>
                <span>Последняя заметка: {notes[notes.length - 1]?.createdAt.toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
