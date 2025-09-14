"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Простой пароль для демонстрации
  const DEMO_PASSWORD = "admin123"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Имитируем проверку пароля
      if (password === DEMO_PASSWORD) {
        // Устанавливаем cookie для авторизации
        document.cookie = "auth-token=authenticated; path=/; max-age=86400" // 24 часа
        
        // Перенаправляем на главную страницу
        router.push("/")
        router.refresh()
      } else {
        setError("Неверный пароль")
      }
    } catch (error) {
      setError("Ошибка входа в систему")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Логотип и заголовок */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learner Platform
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Войдите в свою личную образовательную платформу
          </p>
        </div>

        {/* Форма входа */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Введите пароль для доступа к платформе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Входим..." : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Демонстрационная информация */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Демонстрационный доступ
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                Для входа используйте пароль:
              </p>
              <code className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-sm font-mono text-blue-900 dark:text-blue-100">
                admin123
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Футер */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Персональная образовательная платформа
          </p>
        </div>
      </div>
    </div>
  )
}
