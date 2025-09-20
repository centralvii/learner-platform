'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    XCircle,
    Circle,
    Edit,
    Trash2,
    PlusCircle,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/sandbox/task-form';
import { DeleteConfirmationDialog } from '@/components/courses/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';

interface SandboxTask {
    id: string;
    title: string;
    description: string;
    language: string;
    difficulty: string;
    tags: string[];
    status: 'solved' | 'attempted' | 'not-started';
}

export default function SandboxPage() {
    const [tasks, setTasks] = useState<SandboxTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [editingTask, setEditingTask] = useState<SandboxTask | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const fetchTasks = () => {
        setLoading(true);
        fetch('/api/sandbox/tasks')
            .then((res) => res.json())
            .then((data) => {
                setTasks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching sandbox tasks:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const allTags = [...new Set(tasks.flatMap((task) => task.tags))];

    const filteredTasks = tasks
        .filter(
            (task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedTags.length === 0 ||
                    selectedTags.every((tag) => task.tags.includes(tag)))
        )
        .sort((a, b) => {
            if (sortBy === 'difficulty-asc') {
                const difficulties = ['easy', 'medium', 'hard'];
                return (
                    difficulties.indexOf(a.difficulty) -
                    difficulties.indexOf(b.difficulty)
                );
            } else if (sortBy === 'difficulty-desc') {
                const difficulties = ['easy', 'medium', 'hard'];
                return (
                    difficulties.indexOf(b.difficulty) -
                    difficulties.indexOf(a.difficulty)
                );
            }
            return 0; // default sort
        });

    const handleCreate = async (task: Omit<SandboxTask, 'id' | 'status'>) => {
        await fetch('/api/sandbox/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        setIsCreating(false);
        fetchTasks();
    };

    const handleUpdate = async (task: SandboxTask) => {
        await fetch(`/api/sandbox/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        setEditingTask(null);
        fetchTasks();
    };

    const handleDelete = async (taskId: string) => {
        await fetch(`/api/sandbox/tasks/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'solved':
                return <CheckCircle className="text-green-500" />;
            case 'attempted':
                return <XCircle className="text-red-500" />;
            default:
                return <Circle className="text-gray-400" />;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'hard':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="p-6">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 ">
                        Задания SQL тренажёра
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Упражнения по SQL, приближенные к реальным
                        профессиональным задачам
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="edit-mode">Режим ред.</Label>
                    <Switch
                        id="edit-mode"
                        checked={editMode}
                        onCheckedChange={setEditMode}
                    />
                </div>
            </header>

            <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>
                        Лёгкие:{' '}
                        {tasks.filter((t) => t.difficulty === 'easy').length}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>
                        Средние:{' '}
                        {tasks.filter((t) => t.difficulty === 'medium').length}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>
                        Сложные:{' '}
                        {tasks.filter((t) => t.difficulty === 'hard').length}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {allTags.map((tag) => (
                    <Badge
                        key={tag}
                        variant={
                            selectedTags.includes(tag) ? 'default' : 'secondary'
                        }
                        onClick={() => {
                            setSelectedTags((prev) =>
                                prev.includes(tag)
                                    ? prev.filter((t) => t !== tag)
                                    : [...prev, tag]
                            );
                        }}
                        className="cursor-pointer"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            <div className="flex gap-4 mb-8">
                <Input
                    placeholder="Поиск по названию..."
                    className="bg-gray-100 border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[240px] bg-gray-100 border-gray-300">
                        <SelectValue placeholder="Сортировать по" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">
                            По дате добавления
                        </SelectItem>
                        <SelectItem value="difficulty-asc">
                            Сначала легкие
                        </SelectItem>
                        <SelectItem value="difficulty-desc">
                            Сначала сложные
                        </SelectItem>
                    </SelectContent>
                </Select>
                {editMode && (
                    <Button onClick={() => setIsCreating(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Добавить задачу
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-16">Загрузка...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className="text-xl font-semibold">Нет задач</h2>
                    <p className="text-muted-foreground mt-2">
                        По вашему запросу ничего не найдено.
                    </p>
                </div>
            ) : (
                <div className="border rounded-lg">
                    {filteredTasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="flex items-center justify-between p-4 border-b last:border-b-0"
                        >
                            <Link
                                href={`/sandbox/${task.id}`}
                                className="flex items-center flex-grow"
                            >
                                <span className="text-lg font-medium text-gray-400 mr-6">
                                    {index + 1}
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold">
                                        {task.title}
                                    </h3>
                                    <div className="flex gap-2 mt-1">
                                        {task.tags.map((tag) => (
                                            <Badge key={tag} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${getDifficultyColor(
                                        task.difficulty
                                    )}`}
                                ></div>
                                {getStatusIcon(task.status)}
                                {editMode && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingTask(task)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <DeleteConfirmationDialog
                                            onDelete={() =>
                                                handleDelete(task.id)
                                            }
                                            itemName={`задачу "${task.title}"`}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                open={isCreating || !!editingTask}
                onOpenChange={() => {
                    setIsCreating(false);
                    setEditingTask(null);
                }}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isCreating
                                ? 'Новая задача'
                                : 'Редактировать задачу'}
                        </DialogTitle>
                    </DialogHeader>
                    <TaskForm
                        task={editingTask}
                        onSubmit={editingTask ? handleUpdate : handleCreate}
                        onCancel={() => {
                            setIsCreating(false);
                            setEditingTask(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
