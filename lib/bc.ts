// src/lib/auth.ts
import bcrypt from 'bcryptjs';

// Función para hashear la contraseña
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Número de rondas de sal, puedes ajustarlo según tus necesidades
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Función para verificar la contraseña
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
