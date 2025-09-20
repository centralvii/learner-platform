'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // For simplicity, we'll use a hardcoded password.
        // In a real application, this should be a proper authentication flow.
        if (password === 'password') {
            // Set a cookie and redirect
            document.cookie = 'auth-token=user; path=/; max-age=86400'; // Expires in 1 day
            router.push('/');
            router.refresh();
        } else {
            setError('Неверный пароль');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 ">
            <Card className="w-full max-w-sm mx-4">
                <CardHeader>
                    <CardTitle className="text-2xl">Вход</CardTitle>
                    <CardDescription>
                        Введите пароль для доступа к платформе. (Пароль:
                        password)
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && handleLogin()
                            }
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button onClick={handleLogin} className="w-full">
                        Войти
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
