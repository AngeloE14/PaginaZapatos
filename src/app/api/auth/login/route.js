import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (user.is_verified === 0) {
      return NextResponse.json({ error: 'Por favor, verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.' }, { status: 403 });
    }

    // In a real app we would sign a JWT here. For now we just return user info.
    const { password: _, ...userInfo } = user;
    return NextResponse.json({ user: userInfo, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
