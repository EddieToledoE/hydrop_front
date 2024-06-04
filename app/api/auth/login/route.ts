import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword,hashPassword } from '@/lib/bc';

export async function authenticateUser(req: NextRequest) {
  try {
    const { email, pass } = await req.json();
    if (!email || !pass) {
      return NextResponse.json({ status: 'error', msg: 'Email y contraseña son requeridos.' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email.toLowerCase()]);

    if ((rows as any[]).length > 0) {
      const user = (rows as any)[0];

      if (!user.password) {
        const hashedPassword = await hashPassword(pass);
        await pool.query('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
        user.password = hashedPassword;
      }

      const isPasswordMatch = await verifyPassword(pass, user.password);

      if (isPasswordMatch) {
        // Puedes generar un token JWT si es necesario
        // const token = sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        return NextResponse.json({ status: 'success' });
      } else {
        return NextResponse.json({ status: 'error', msg: 'Email y contraseña no coinciden.' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ status: 'error', msg: 'Email y contraseña no coinciden.' }, { status: 401 });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
