import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import pool from "@/lib/db";
import { verifyPassword } from "@/lib/bc";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials,req) {
        const { username, password } = credentials as Record<"username" | "password", string>;
        console.log('credentials',credentials)
        try {
          const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [username.toLowerCase()]);
          if ((rows as any[]).length > 0) {
            const user = (rows as any)[0];
            console.log('El usuario es',user)
            if (!user.password) {
              return null;
            }
            console.log(password,user.password)
            const isPasswordMatch = await verifyPassword(password, user.password);
            console.log("El resultado de la comparacion fue "+isPasswordMatch)
            if (isPasswordMatch) {
              return user;
            }
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST }
