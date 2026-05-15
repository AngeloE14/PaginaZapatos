import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await initDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // In a real app we would sign a JWT here. For now we just return user info.
    const { password: _, ...userInfo } = user;
    return NextResponse.json({ user: userInfo, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
