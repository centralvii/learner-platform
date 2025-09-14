"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Target,
  Award,
  Calendar
} from "lucide-react"

// Временные данные для демонстрации
const mockProgressData = {
  totalCourses: 3,
  completedCourses: 0,
  totalLessons: 10,
  completedLessons: 2,
  totalStudyTime: 180, // в минутах
  thisWeekTime: 45,
  streak: 3, // дни подряд
  achievements: [
    { id: 1, title: "Первые шаги", description: "Начал изучение первого курса", earned: true },
    { id: 2, title: "Настойчивость", description: "Изучал 3 дня подряд", earned: true },
    { id: 3, title: "Знаток", description: "Завершил первый курс", earned: false },
  ]
}

const courseProgress = [
  {
    id: "1",
    title: "Основы JavaScript",
    completed: 2,
    total: 5,
    progress: 40,
    lastAccessed: new Date("2024-01-20T14:30:00"),
  },
  {
    id: "2",
    title: "React для начинающих",
    completed: 0,
    total: 4,
    progress: 0,
    lastAccessed: new Date("2024-01-18T10:15:00"),
  },
  {
    id: "3",
    title: "Node.js и Backend разработка",
    completed: 0,
    total: 1,
    progress: 0,
    lastAccessed: null,
  }
]

export default function ProgressPage() {
  const overallProgress = mockProgressData.totalLessons > 0 
    ? Math.round((mockProgressData.completedLessons / mockProgressData.totalLessons) * 100) 
    : 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Мой прогресс
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Отслеживайте свои достижения и прогресс в обучении
        </p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий прогресс</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {mockProgressData.completedLessons} из {mockProgressData.totalLessons} уроков
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные курсы</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProgressData.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {mockProgressData.completedCourses} завершено
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время обучения</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(mockProgressData.totalStudyTime / 60)}ч</div>
            <p className="text-xs text-muted-foreground">
              {mockProgressData.thisWeekTime} мин на этой неделе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Серия дней</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProgressData.streak}</div>
            <p className="text-xs text-muted-foreground">
              дней подряд
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Прогресс по курсам */}
      <Card>
        <CardHeader>
          <CardTitle>Прогресс по курсам</CardTitle>
          <CardDescription>
            Детальная информация о прохождении каждого курса
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map(course => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{course.title}</h3>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex-1">
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-600 min-w-0">
                      {course.completed}/{course.total} уроков
                    </span>
                    <Badge variant={course.progress > 0 ? "default" : "secondary"}>
                      {course.progress}%
                    </Badge>
                  </div>
                  {course.lastAccessed && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Последний раз: {course.lastAccessed.toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <Button variant="outline" size="sm">
                    Продолжить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Достижения */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Достижения
          </CardTitle>
          <CardDescription>
            Ваши успехи и награды за обучение
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProgressData.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 border rounded-lg text-center ${
                  achievement.earned 
                    ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" 
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <div className="mb-2">
                  {achievement.earned ? (
                    <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto" />
                  ) : (
                    <div className="h-8 w-8 border-2 border-dashed border-gray-400 rounded-full mx-auto" />
                  )}
                </div>
                <h3 className={`font-medium ${achievement.earned ? "text-yellow-900 dark:text-yellow-100" : "text-gray-600"}`}>
                  {achievement.title}
                </h3>
                <p className={`text-xs mt-1 ${achievement.earned ? "text-yellow-700 dark:text-yellow-300" : "text-gray-500"}`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
