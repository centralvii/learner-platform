"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Database, 
  Download,
  Upload,
  Trash2,
  Info,
  Shield,
  Palette,
  Bell
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Настройки
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Управление настройками платформы и данными
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Управление данными */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Управление данными
            </CardTitle>
            <CardDescription>
              Экспорт, импорт и очистка данных платформы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Экспорт данных</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Скачать все курсы, заметки и закладки
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Импорт данных</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Загрузить данные из файла
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Импорт
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-600">Очистить данные</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Удалить все пользовательские данные
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>
              Настройки доступа и безопасности
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Изменить пароль</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Текущий пароль: admin123
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Изменить
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Автоматический выход</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Выход после 24 часов бездействия
                  </p>
                </div>
                <Badge variant="secondary">Включено</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Внешний вид */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>
              Настройка темы и интерфейса
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Тема</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Светлая или темная тема
                  </p>
                </div>
                <Badge variant="outline">Системная</Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Размер шрифта</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Размер текста в уроках
                  </p>
                </div>
                <Badge variant="outline">Средний</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
            <CardDescription>
              Настройка напоминаний и уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Напоминания об обучении</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Ежедневные напоминания
                  </p>
                </div>
                <Badge variant="secondary">Отключено</Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Достижения</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Уведомления о новых достижениях
                  </p>
                </div>
                <Badge variant="default">Включено</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Информация о системе */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Информация о системе
          </CardTitle>
          <CardDescription>
            Техническая информация и статистика
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Курсов</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">6</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Уроков</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">4</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Заметок</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">5</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Закладок</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* О приложении */}
      <Card className="bg-gray-50 dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Learner Platform</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Персональная образовательная платформа для структурирования учебных материалов
            </p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>Версия 1.0.0</span>
              <span>•</span>
              <span>Next.js + PostgreSQL</span>
              <span>•</span>
              <span>shadcn/ui</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
