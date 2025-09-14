import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Простая функция проверки авторизации
function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('auth-token')?.value
  return authToken === 'authenticated'
}

export function middleware(request: NextRequest) {
  // Список защищенных путей
  const protectedPaths = ['/courses', '/progress', '/notes', '/bookmarks', '/settings']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  // Путь для входа
  const loginPath = '/login'
  const isLoginPath = request.nextUrl.pathname === loginPath
  
  // Если пользователь на странице входа и уже авторизован, перенаправляем на главную
  if (isLoginPath && isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Если пользователь пытается получить доступ к защищенным путям без авторизации
  if (isProtectedPath && !isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Исключаем:
     * - API роуты (/api)
     * - static файлы (/static)
     * - favicon и другие метаданные
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
