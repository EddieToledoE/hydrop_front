import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectarBD } from "@/libs/mongodb";
import Usuario from "@/models/user";
import bcrypt from 'bcryptjs';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "Correo@gmail.com" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                await connectarBD();

                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("No se han proporcionado credenciales");
                }

                const UsuarioEncontrado = await Usuario.findOne({ email: credentials.email });
                if (!UsuarioEncontrado) {
                    throw new Error("Usuario no encontrado");
                }

                const coincidencia = await bcrypt.compare(credentials.password, UsuarioEncontrado.password);
                if (!coincidencia) {
                    throw new Error("La contraseña no coincide");
                }

                return { id: UsuarioEncontrado._id.toString(), email: UsuarioEncontrado.email, name: UsuarioEncontrado.name };
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        session({ session, token }) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        }
    },
    pages: {
        signIn: "/"
    }
});

export { handler as GET, handler as POST };
