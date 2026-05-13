import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
    }

    // Hash password & generate token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert user with verification token
    const insert = db.prepare('INSERT INTO users (name, email, password, is_verified, verification_token) VALUES (?, ?, ?, 0, ?)');
    const result = insert.run(name, email, hashedPassword, verificationToken);

    // Configurar Nodemailer (Asegúrate de agregar EMAIL_USER y EMAIL_PASS a tu .env)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Get the host from the request headers or fallback to localhost
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const verificationUrl = `${protocol}://${host}/api/auth/verify?token=${verificationToken}`;

    const mailOptions = {
      from: `"Calzado del Pueblo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifica tu cuenta - Calzado del Pueblo',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #d4af37; text-align: center;">¡Bienvenido a Calzado del Pueblo, ${name}!</h2>
          <p>Gracias por crear una cuenta con nosotros. Para poder iniciar sesión y realizar compras, necesitamos verificar que este es tu correo electrónico.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Si no solicitaste crear esta cuenta, puedes ignorar este correo de forma segura.</p>
        </div>
      `
    };

    // Send email asynchronously
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail(mailOptions).catch(err => {
        console.error("Error enviando correo:", err);
      });
    } else {
      console.log('FALTAN CREDENCIALES DE CORREO EN .env. No se envió el email.');
    }

    // SIEMPRE imprimir el link en consola por si el correo falla o tarda en llegar
    console.log('\n=============================================');
    console.log('🔗 ENLACE DE VERIFICACIÓN (LOCAL):');
    console.log(verificationUrl);
    console.log('=============================================\n');

    return NextResponse.json({ 
      message: 'Cuenta creada. Revisa tu correo electrónico (o la consola de tu terminal) para verificar tu cuenta antes de iniciar sesión.' 
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor al registrar usuario' }, { status: 500 });
  }
}
