import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Check if user exists
    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
    }

    // Hash password & generate token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user without verification token (is_verified = 1)
    const insertedUser = await sql`
      INSERT INTO users (name, email, password, is_verified) 
      VALUES (${name}, ${email}, ${hashedPassword}, 1)
      RETURNING id, name, email, is_verified
    `;

    return NextResponse.json({ 
      message: 'Cuenta creada exitosamente',
      user: insertedUser[0]
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor al registrar usuario' }, { status: 500 });
  }
}
