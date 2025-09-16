'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FileText, Bookmark } from 'lucide-react'

interface SelectionMenuProps {
    onAddNote: (content: string) => void;
    onAddBookmark: (title: string) => void;
}

export function SelectionMenu({ onAddNote, onAddBookmark }: SelectionMenuProps) {
    const [selection, setSelection] = useState<Selection | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleMouseUp = useCallback(() => {
        const currentSelection = window.getSelection();
        if (currentSelection && !currentSelection.isCollapsed) {
            setSelection(currentSelection);
            setPopoverOpen(true);
        } else {
            setPopoverOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    useEffect(() => {
        if (popoverOpen && selection && popoverRef.current) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            popoverRef.current.style.top = `${window.scrollY + rect.top - popoverRef.current.offsetHeight - 10}px`;
            popoverRef.current.style.left = `${window.scrollX + rect.left + rect.width / 2 - popoverRef.current.offsetWidth / 2}px`;
        }
    }, [popoverOpen, selection]);

    if (!popoverOpen || !selection) {
        return null;
    }

    const selectedText = selection.toString();

    return (
        <div ref={popoverRef} className="fixed z-50">
            <div className="bg-background border rounded-lg shadow-lg p-1 flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onAddNote(selectedText)}>
                    <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onAddBookmark(selectedText)}>
                    <Bookmark className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
