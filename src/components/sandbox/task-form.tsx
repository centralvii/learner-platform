'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Task {
    id?: string;
    title: string;
    description: string;
    language: string;
    initialCode: string | null;
    solution: string;
}

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (task: Task) => void;
    onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('sql');
    const [initialCode, setInitialCode] = useState('');
    const [solution, setSolution] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setLanguage(task.language);
            setInitialCode(task.initialCode || '');
            setSolution(task.solution);
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData: Task = { title, description, language, initialCode, solution };
        if (task?.id) {
            taskData.id = task.id;
        }
        onSubmit(taskData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Название</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="language">Язык</Label>
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sql">SQL</SelectItem>
                        <SelectItem value="javascript" disabled>JavaScript</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="initialCode">Начальный код</Label>
                <Textarea id="initialCode" value={initialCode} onChange={(e) => setInitialCode(e.target.value)} rows={5} />
            </div>
            <div>
                <Label htmlFor="solution">Решение</Label>
                <Textarea id="solution" value={solution} onChange={(e) => setSolution(e.target.value)} rows={5} required />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    )
}
