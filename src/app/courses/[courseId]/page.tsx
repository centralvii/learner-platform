"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  FileText, 
  CheckCircle,
  Circle,
  Clock,
  Users
} from "lucide-react"

interface CourseData {
  id: string
  title: string
  description: string
  tags: string[]
  createdAt: string
  chapters: {
    id: string
    title: string
    order: number
    lessons: {
      id: string
      title: string
      content: string
      videoUrl: string | null
      attachments: string[]
      order: number
      completed: boolean
    }[]
  }[]
}

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [openChapters, setOpenChapters] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/courses/${params.courseId}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data)
        if (data.chapters.length > 0) {
          setOpenChapters([data.chapters[0].id])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching course:', err)
        setLoading(false)
      })
  }, [params.courseId])

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  const handleLessonClick = (courseId: string, lessonId: string) => {
    router.push(`/courses/${courseId}/lessons/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Курс не найден
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Курс с данным идентификатором не существует
          </p>
        </div>
      </div>
    )
  }

  const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)
  const completedLessons = course.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.filter(lesson => lesson.completed).length, 0
  )
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок курса */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {course.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Статистика курса */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{course.chapters.length} глав</p>
                  <p className="text-xs text-gray-500">{totalLessons} уроков</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{completedLessons} завершено</p>
                  <p className="text-xs text-gray-500">из {totalLessons} уроков</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">{progressPercentage}% прогресс</p>
                  <Progress value={progressPercentage} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Создан</p>
                  <p className="text-xs text-gray-500">{new Date(course.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Структура курса */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Содержание курса
        </h2>
        
        <div className="space-y-2">
          {course.chapters.map(chapter => {
            const chapterCompletedLessons = chapter.lessons.filter(l => l.completed).length
            const chapterProgress = chapter.lessons.length > 0 
              ? Math.round((chapterCompletedLessons / chapter.lessons.length) * 100) 
              : 0
            
            return (
              <Card key={chapter.id}>
                <Collapsible
                  open={openChapters.includes(chapter.id)}
                  onOpenChange={() => toggleChapter(chapter.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {openChapters.includes(chapter.id) 
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />
                          }
                          <div className="text-left">
                            <CardTitle className="text-lg">
                              Глава {chapter.order}: {chapter.title}
                            </CardTitle>
                            <CardDescription>
                              {chapter.lessons.length} уроков • {chapterProgress}% завершено
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={chapterProgress} className="w-24 h-2" />
                          <Badge variant="outline" className="text-xs">
                            {chapterCompletedLessons}/{chapter.lessons.length}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {chapter.lessons.map(lesson => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                            onClick={() => handleLessonClick(course.id, lesson.id)}
                          >
                            <div className="flex items-center space-x-3">
                              {lesson.completed 
                                ? <CheckCircle className="h-4 w-4 text-green-600" />
                                : <Circle className="h-4 w-4 text-gray-400" />
                              }
                              <div>
                                <p className="text-sm font-medium">
                                  {lesson.order}. {lesson.title}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  {lesson.videoUrl && (
                                    <div className="flex items-center space-x-1">
                                      <Play className="h-3 w-3" />
                                      <span>Видео</span>
                                    </div>
                                  )}
                                  {lesson.content && (
                                    <div className="flex items-center space-x-1">
                                      <FileText className="h-3 w-3" />
                                      <span>Материал</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLessonClick(course.id, lesson.id)
                              }}
                            >
                              {lesson.completed ? "Повторить" : "Начать"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Действия */}
      <div className="flex gap-4">
        <Button size="lg" className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Продолжить обучение
        </Button>
        <Button variant="outline" size="lg">
          Редактировать курс
        </Button>
      </div>
    </div>
  )
}
