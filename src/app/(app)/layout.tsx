'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { LessonSidebar } from '@/components/lesson-sidebar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isLessonPage = pathname.includes('/lessons/');

    return (
        <div className="flex h-screen">
            {isLessonPage ? (
                <LessonSidebar />
            ) : (
                <Sidebar
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            )}
            <main
                className={cn(
                    'flex-1 overflow-auto transition-all duration-300',
                    isLessonPage ? 'pl-16' : isCollapsed ? 'pl-20' : ''
                )}
            >
                {children}
            </main>
        </div>
    );
}
