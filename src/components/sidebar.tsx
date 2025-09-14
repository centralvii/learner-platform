"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Home, 
  FileText, 
  Bookmark, 
  Settings,
  GraduationCap,
  LogOut
} from "lucide-react"

const navigation = [
  {
    name: "Главная",
    href: "/",
    icon: Home,
  },
  {
    name: "Курсы",
    href: "/courses",
    icon: BookOpen,
  },
  {
    name: "Мой прогресс",
    href: "/progress",
    icon: GraduationCap,
  },
  {
    name: "Заметки",
    href: "/notes",
    icon: FileText,
  },
  {
    name: "Закладки",
    href: "/bookmarks",
    icon: Bookmark,
  },
  {
    name: "Настройки",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Удаляем cookie авторизации
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    // Перенаправляем на страницу входа
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Learner Platform
        </h1>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                    isActive
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 shrink-0 transition-colors",
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
          >
            <LogOut className="h-6 w-6 shrink-0" />
            Выйти
          </Button>
        </div>
      </nav>
    </div>
  )
}
