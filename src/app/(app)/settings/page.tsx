'use client';

import { ModelSelect } from '@/components/settings/model-select';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    Database,
    Download,
    Upload,
    Trash2,
    Info,
    Shield,
    Palette,
    Bell,
} from 'lucide-react';

export default function SettingsPage() {
    const [isClearing, setIsClearing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleClearData = async () => {
        setIsClearing(true);
        try {
            const response = await fetch('/api/data/clear', { method: 'POST' });
            if (response.ok) {
                alert('Все данные были успешно удалены.');
                window.location.reload();
            } else {
                alert('Произошла ошибка при очистке данных.');
            }
        } catch (error) {
            console.error('Clear data error:', error);
            alert('Произошла ошибка при очистке данных.');
        } finally {
            setIsClearing(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result;
                if (typeof content !== 'string') return;
                const data = JSON.parse(content);
                
                setIsImporting(true);
                const response = await fetch('/api/data/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Данные успешно импортированы.');
                    window.location.reload();
                } else {
                    alert('Произошла ошибка при импорте данных.');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Ошибка при чтении или отправке файла.');
            } finally {
                setIsImporting(false);
            }
        };
        reader.readAsText(file);
    };

    const handleChangePassword = async () => {
        if (!newPassword) {
            alert('Пожалуйста, введите новый пароль.');
            return;
        }
        try {
            const response = await fetch('/api/settings/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });
            if (response.ok) {
                alert('Пароль успешно изменен.');
                setNewPassword('');
            } else {
                alert('Произошла ошибка при изменении пароля.');
            }
        } catch (error) {
            console.error('Change password error:', error);
            alert('Произошла ошибка при изменении пароля.');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            <div>
                <h1 className="text-3xl font-bold text-gray-900 ">Настройки</h1>
                <p className="mt-2 text-gray-600 ">
                    Управление настройками платформы и данными
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Управление данными */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Управление данными
                        </CardTitle>
                        <CardDescription>
                            Экспорт, импорт и очистка данных платформы
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Экспорт данных
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Скачать все курсы, заметки и закладки
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        (window.location.href =
                                            '/api/data/export')
                                    }
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Экспорт
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Импорт данных
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Загрузить данные из файла
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleImportClick} disabled={isImporting}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    {isImporting ? 'Импорт...' : 'Импорт'}
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-red-600">
                                        Очистить данные
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Удалить все пользовательские данные
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Очистить
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Вы уверены?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Это действие невозможно
                                                отменить. Все ваши данные,
                                                включая курсы, прогресс, заметки
                                                и закладки, будут безвозвратно
                                                удалены.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Отмена
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleClearData}
                                                disabled={isClearing}
                                            >
                                                {isClearing
                                                    ? 'Удаление...'
                                                    : 'Да, удалить все данные'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Безопасность */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Безопасность
                        </CardTitle>
                        <CardDescription>
                            Настройки доступа и безопасности
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Изменить пароль
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Текущий пароль: admin123
                                    </p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            Изменить
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Изменить пароль</DialogTitle>
                                            <DialogDescription>
                                                Введите новый пароль.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="new-password" className="text-right">
                                                    Новый пароль
                                                </Label>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleChangePassword}>Сохранить</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Автоматический выход
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Выход после 24 часов бездействия
                                    </p>
                                </div>
                                <Badge variant="secondary">Включено</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Внешний вид */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Внешний вид
                        </CardTitle>
                        <CardDescription>
                            Настройка темы и интерфейса
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Тема
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Светлая или темная тема
                                    </p>
                                </div>
                                <Badge variant="outline">Системная</Badge>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Размер шрифта
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Размер текста в уроках
                                    </p>
                                </div>
                                <Badge variant="outline">Средний</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Уведомления */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Уведомления
                        </CardTitle>
                        <CardDescription>
                            Настройка напоминаний и уведомлений
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Напоминания об обучении
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Ежедневные напоминания
                                    </p>
                                </div>
                                <Badge variant="secondary">Отключено</Badge>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">
                                        Достижения
                                    </h4>
                                    <p className="text-xs text-gray-600 ">
                                        Уведомления о новых достижениях
                                    </p>
                                </div>
                                <Badge variant="default">Включено</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Настройки ИИ */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Настройки ИИ
                        </CardTitle>
                        <CardDescription>
                            Выбор модели ИИ для чата
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModelSelect />
                    </CardContent>
                </Card>
            </div>

            {/* Информация о системе */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Информация о системе
                    </CardTitle>
                    <CardDescription>
                        Техническая информация и статистика
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                2
                            </p>
                            <p className="text-xs text-gray-600 ">Курсов</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                6
                            </p>
                            <p className="text-xs text-gray-600 ">Уроков</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-600">
                                4
                            </p>
                            <p className="text-xs text-gray-600 ">Заметок</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-600">
                                5
                            </p>
                            <p className="text-xs text-gray-600 ">Закладок</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* О приложении */}
            <Card className="bg-gray-50 ">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                            Vibe Learn
                        </h3>
                        <p className="text-sm text-gray-600  mb-4">
                            Персональная образовательная платформа для
                            структурирования учебных материалов
                        </p>
                        <div className="flex justify-center gap-4 text-xs text-gray-500">
                            <span>Версия 1.0.0</span>
                            <span>•</span>
                            <span>Next.js + PostgreSQL</span>
                            <span>•</span>
                            <span>shadcn/ui</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
