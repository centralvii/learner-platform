'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Home,
    FileText,
    Bookmark,
    Settings,
    GraduationCap,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Code,
} from 'lucide-react';
import { GlobalSearch } from '@/components/global-search';
import { useState } from 'react';
import Image from 'next/image';

const navigation = [
    {
        name: 'Главная',
        href: '/',
        icon: Home,
    },
    {
        name: 'Курсы',
        href: '/courses',
        icon: BookOpen,
    },
    {
        name: 'Мой прогресс',
        href: '/progress',
        icon: GraduationCap,
    },
    {
        name: 'Песочница',
        href: '/sandbox',
        icon: Code,
    },
    {
        name: 'Заметки',
        href: '/notes',
        icon: FileText,
    },
    {
        name: 'Закладки',
        href: '/bookmarks',
        icon: Bookmark,
    },
    {
        name: 'Настройки',
        href: '/settings',
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        // Удаляем cookie авторизации
        document.cookie =
            'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        // Перенаправляем на страницу входа
        router.push('/login');
        router.refresh();
    };

    return (
        <div
            className={cn(
                'flex h-full flex-col bg-gray-50  transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            <div
                className={cn(
                    'flex h-16 shrink-0 items-center',
                    isCollapsed ? 'justify-center' : 'px-4'
                )}
            >
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="Vibe Learn Logo"
                        width={30}
                        height={30}
                    />
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-gray-900 transition-opacity duration-300 delay-150 opacity-100">
                            Vibe Learn
                        </h1>
                    )}
                </Link>
            </div>
            <nav className="flex flex-1 flex-col px-4 py-4">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                    <li className="mb-2">
                        <GlobalSearch isCollapsed={isCollapsed} />
                    </li>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                                        isCollapsed
                                            ? 'justify-center h-10'
                                            : 'gap-x-3',
                                        isActive
                                            ? 'bg-gray-200 text-gray-900  '
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 '
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'h-6 w-6 shrink-0 transition-colors',
                                            isActive
                                                ? 'text-gray-900 '
                                                : 'text-gray-400 group-hover:text-gray-900 '
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span
                                        className={cn(
                                            'transition-opacity duration-300 delay-150',
                                            isCollapsed
                                                ? 'opacity-0 w-0 overflow-hidden'
                                                : 'opacity-100 w-auto'
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-auto pt-4 border-t flex flex-col gap-y-1">
                    <Button
                        variant="ghost"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            'w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 ',
                            isCollapsed ? 'justify-center' : 'justify-start'
                        )}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-6 w-6 shrink-0" />
                        ) : (
                            <ChevronLeft className="h-6 w-6 shrink-0" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={cn(
                            'w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 ',
                            isCollapsed
                                ? 'justify-center'
                                : 'justify-start gap-x-3'
                        )}
                    >
                        <LogOut className="h-6 w-6 shrink-0" />
                        <span
                            className={cn(
                                'transition-opacity duration-300 delay-150',
                                isCollapsed
                                    ? 'opacity-0 w-0 overflow-hidden hidden'
                                    : 'opacity-100 w-auto'
                            )}
                        >
                            Выйти
                        </span>
                    </Button>
                </div>
            </nav>
        </div>
    );
}
