'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, FileText, Bookmark } from "lucide-react"

interface Course {
  id: string;
  title: string;
}

interface Note {
  id: string;
  content: string;
  lesson: { title: string };
}

interface ProgressData {
  totalCourses: number
  totalLessons: number
  completedLessons: number
  totalNotes: number
  totalBookmarks: number
  progressPercentage: number
  recentCourses: Course[];
  recentNotes: Note[];
}

export default function Home() {
  const [stats, setStats] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching stats:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
        </div>
      </div>
    )
  }
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Привет! Добро пожаловать в Learner Platform
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Ваша персональная платформа для структурирования учебных материалов и отслеживания прогресса
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Курсы</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Всего курсов
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прогресс</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.progressPercentage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedLessons || 0} из {stats?.totalLessons || 0} уроков
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заметки</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalNotes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Всего заметок
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Закладки</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookmarks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Всего закладок
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние курсы</CardTitle>
            <CardDescription>
              Курсы, которые вы недавно создали
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentCourses && stats.recentCourses.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentCourses.map(course => (
                  <li key={course.id}>
                    <Link href={`/courses/${course.id}`} className="font-semibold hover:underline">
                      {course.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Нет недавно созданных курсов
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Последние заметки</CardTitle>
            <CardDescription>
              Ваши последние заметки к урокам
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentNotes && stats.recentNotes.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentNotes.map(note => (
                  <li key={note.id} className="text-sm">
                    <p className="font-semibold truncate">{note.content}</p>
                    <p className="text-xs text-muted-foreground">к уроку: {note.lesson.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Нет недавних заметок
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
