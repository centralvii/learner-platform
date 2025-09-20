
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { newPassword } = await req.json();

    if (!newPassword) {
      return new NextResponse('New password is required', { status: 400 });
    }

    // Здесь будет логика для обновления пароля в базе данных
    console.log(`Password changed to: ${newPassword}`);

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('[PASSWORD_CHANGE_API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
