"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BookOpen, Clock } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  tags: string[]
  createdAt: string
  chaptersCount: number
  lessonsCount: number
  progress: number
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching courses:', err)
        setLoading(false)
      })
  }, [])

  // Получаем все уникальные теги
  const allTags = Array.from(new Set(courses.flatMap(course => course.tags)))

  // Фильтруем курсы по поиску и тегам
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => course.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Каталог курсов
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Управляйте своими учебными курсами
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Добавить курс
        </Button>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Найти курс..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Фильтры по тегам */}
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTags([])}
            className="text-sm"
          >
            Очистить фильтры
          </Button>
        )}
      </div>

      {/* Список курсов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <Card 
            key={course.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCourseClick(course.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <Badge variant="outline" className="text-xs">
                  {course.progress}% завершено
                </Badge>
              </div>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {course.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{course.tags.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{course.chaptersCount} глав</span>
                <span>{course.lessonsCount} уроков</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(course.createdAt).toLocaleDateString('ru-RU')}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCourseClick(course.id)
                }}
              >
                Перейти к курсу
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Курсы не найдены
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Попробуйте изменить критерии поиска или добавьте новый курс
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить первый курс
          </Button>
        </div>
      )}
    </div>
  )
}
