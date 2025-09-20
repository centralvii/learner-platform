'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FileText, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectionMenuProps {
    onAddNote: (content: string) => void;
    onAddBookmark: (title: string) => void; // Keep for now, but will be replaced by onAskAI
    onAskAI: (content: string) => void;
}

export function SelectionMenu({ onAddNote, onAddBookmark, onAskAI }: SelectionMenuProps) {
    const [selection, setSelection] = useState<Selection | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    console.log('SelectionMenu: popoverOpen state:', popoverOpen);

    const handleMouseUp = useCallback(() => {
        const currentSelection = window.getSelection();
        if (currentSelection && !currentSelection.isCollapsed) {
            setSelection(currentSelection);
            setTimeout(() => {
                // Only open if the popover is not already open and selection is still valid
                const latestSelection = window.getSelection();
                if (!popoverOpen && latestSelection && !latestSelection.isCollapsed) {
                    setPopoverOpen(true);
                }
            }, 50); // 50ms delay
        } 
    }, [popoverOpen]);

    useEffect(() => {
        // Listener for opening the menu on selection
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    // Effect to close the popover when selection collapses or on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setPopoverOpen(false);
            }
        };

        if (popoverOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Close if selection collapses while popover is open
        const handleSelectionChange = () => {
            const currentSelection = window.getSelection();
            if (popoverOpen && (!currentSelection || currentSelection.isCollapsed)) {
                setPopoverOpen(false);
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [popoverOpen]);

    useEffect(() => {
        if (popoverOpen && selection && popoverRef.current && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            popoverRef.current.style.top = `${window.scrollY + rect.bottom + 10}px`; // Position below
            popoverRef.current.style.left = `${window.scrollX + rect.left + rect.width / 2 - popoverRef.current.offsetWidth / 2}px`;
        }
    }, [popoverOpen, selection]);

    if (!popoverOpen || !selection) {
        return null;
    }

    const selectedText = selection.toString();

    const handleAddNoteAndClose = () => {
        onAddNote(selectedText);
        setPopoverOpen(false);
    };

    const handleAskAIAndClose = () => {
        onAskAI(selectedText);
        setPopoverOpen(false);
    };

    return (
        <div 
            ref={popoverRef} 
            className={cn(
                "fixed z-50 transition-all duration-200 ease-out",
                popoverOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
        >
            <div className="flex flex-col gap-1">
                <Button variant="ghost" className='bg-black text-white' onClick={handleAddNoteAndClose}>
                    Сохранить в заметки
                </Button>
                <Button variant="ghost" className='bg-black text-white' onClick={handleAskAIAndClose}>
                    Спросить у нейросети
                </Button>
            </div>
        </div>
    );

