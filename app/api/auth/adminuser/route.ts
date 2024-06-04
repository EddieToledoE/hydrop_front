import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/bc';
import { ResultSetHeader } from 'mysql2/promise';

// Handler for GET request to fetch all admin users
export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users');
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Handler for POST request to create a new admin user
export async function POST(req: NextRequest) {
  try {
    const registerdate = new Date().toISOString();
    const { name, lastname, email, password, rol} = await req.json();
    const hashedPassword = await hashPassword(password);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO admin_users (name, lastname, email, password, rol, registerdate) VALUES (?, ?, ?, ?, ?, ?)',
      [name, lastname, email, hashedPassword, rol, registerdate]
    );

    return NextResponse.json({ id: result.insertId, name, lastname, email, rol, registerdate });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
