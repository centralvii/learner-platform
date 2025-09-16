'use client';

import { Sidebar } from '@/components/sidebar';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <main
                className={`flex-1 overflow-auto transition-all duration-300 `}
            >
                {children}
            </main>
        </div>
    );
}
