'use client'

import { cn } from '@/lib/utils'
import { useRef, useEffect } from 'react'

interface SlidingSidebarProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  excludeRef?: React.RefObject<HTMLElement>
  disableOutsideClick?: boolean
  disableBackdrop?: boolean
  hasRightBorder?: boolean
}

export function SlidingSidebar({ isOpen, onClose, children, excludeRef, disableOutsideClick, disableBackdrop, hasRightBorder }: SlidingSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (disableOutsideClick) return; // Do nothing if outside click is disabled

      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Check if the click is on the excluded ref (LessonSidebar buttons)
        if (excludeRef && excludeRef.current && excludeRef.current.contains(event.target as Node)) {
          return; // Do nothing if click is on excluded element
        }
        // Add a small delay to prevent rapid re-opening
        setTimeout(() => {
          onClose()
        }, 100); // 100ms delay
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, excludeRef, disableOutsideClick])

  return (
    <>
      {/* Backdrop */}
      {!disableBackdrop && (
        <div
          className={cn(
            'fixed inset-0 bg-black/50 z-30 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            'ml-16' // Offset for the icon sidebar
          )}
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-16 h-full w-80 bg-background z-40 transition-transform duration-300 ease-in-out',
          isOpen ? 'transform-none' : '-translate-x-full',
          hasRightBorder && 'border-r'
        )}
      >
        {children}
      </div>
    </>
  )
}