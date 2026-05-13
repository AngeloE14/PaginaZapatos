import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Token de verificación inválido.', { status: 400 });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token);

    if (!user) {
      return new NextResponse('Token inválido o expirado.', { status: 400 });
    }

    // Marcar como verificado y limpiar el token
    db.prepare('UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?').run(user.id);

    // Redirigir al usuario al inicio con un mensaje
    return new NextResponse(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/" />
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #fafafa; color: #1a1a1a; }
            .box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2); text-align: center; }
            h1 { color: #d4af37; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>¡Cuenta verificada con éxito!</h1>
            <p>Ya puedes iniciar sesión en Calzado del Pueblo.</p>
            <p style="opacity: 0.7; font-size: 0.9em;">Redirigiendo a la página principal en 3 segundos...</p>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error) {
    return new NextResponse('Error al verificar la cuenta.', { status: 500 });
  }
}
