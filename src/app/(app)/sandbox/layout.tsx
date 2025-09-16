'use client'

export default function SandboxLayout({ 
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex flex-col">
            {children}
        </div>
    );
}
