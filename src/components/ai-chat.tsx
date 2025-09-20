'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiChatProps {
    isOpen: boolean;
    onClose: () => void;
    lessonContext: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AiChat({ isOpen, onClose, lessonContext }: AiChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages, isLoading, isOpen])

    const handleSendMessage = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const selectedModel = localStorage.getItem('ai_model') || 'mistralai/Mistral-Nemo-Instruct-2407';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages,
                    lessonContext: lessonContext,
                    model: selectedModel,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const aiMessage: Message = {
                role: 'assistant',
                content: data.content,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Произошла ошибка при отправке сообщения.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-4 w-96 max-w-lg h-[60vh] bg-background border rounded-lg shadow-xl flex flex-col z-50">
            <header className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Чат</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                'flex items-start gap-3',
                                message.role === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            )}
                        >
                            {message.role === 'assistant' && (
                                <div className="bg-primary text-primary-foreground rounded-full p-2">
                                    <Bot className="h-5 w-5" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    'p-3 rounded-lg max-w-[80%]',
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}
                            >
                                <p className="text-sm">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                                <div className="bg-muted rounded-full p-2">
                                    <User className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                                <Bot className="h-5 w-5 animate-spin" />
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm animate-pulse">
                                    Печатает...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <footer className="p-4 border-t">
                <div className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === 'Enter' && handleSendMessage()
                        }
                        placeholder="Спросите что-нибудь..."
                        disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </footer>
        </div>
    );
}
