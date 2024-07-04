import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/bc';

// Configurar el transportador de Nodemailer con los detalles del servidor SMTP de Hostgator
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email', // Host SMTP de Titan Email
  port: 465, // Puerto SMTP seguro
  secure: true, // Usar SSL
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico de Titan
    pass: process.env.EMAIL_PASS, // Tu contraseña de correo electrónico de Titan
  },
});

// Función para generar una nueva contraseña aleatoria
function generateNewPassword() {
  return Math.random().toString(36).slice(-8);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Generar una nueva contraseña y encriptarla
    const newPassword = generateNewPassword();
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar la contraseña del usuario en la base de datos
    const [result] = await pool.query('UPDATE admin_users SET password = ? WHERE email = ?', [hashedPassword, email]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'No se encontró el usuario con el correo proporcionado' }, { status: 404 });
    }

    // Configurar el correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecimiento de contraseña',
      text: `Tu nueva contraseña es: ${newPassword}`,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado');
    return NextResponse.json({ message: 'Correo electrónico enviado' });
    
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 })
   
  }
}
