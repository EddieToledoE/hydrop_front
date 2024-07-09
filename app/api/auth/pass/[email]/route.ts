import { NextResponse } from "next/server";
import Usuario from "@/models/user";
import bcrypt from "bcryptjs";
import { connectarBD } from "@/libs/mongodb";
import nodemailer from 'nodemailer';

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

// Función para enviar el correo con Nodemailer
async function enviarCorreo(email: string, codigo: string) {
  try {
    const mailOptions = {
      from: `Soporte Hydrop <${process.env.EMAIL_USER}>`,
      to: [email, "teddyrepollo@gmail.com"],
      subject: "Contraseña olvidada",
      text: `Hydrop\nHola: ${email}\nSu código es: ${codigo}\nPuede modificar su contraseña posteriormente dentro de la app\nGracias por confiar en nosotros`,
    };

    // Enviar el correo sin el callback, aprovechando async/await
    const correo = await transporter.sendMail(mailOptions);

    console.log("Correo enviado correctamente");
    return correo;
  } catch (error) {
    console.error("Error al enviar el correo", error);
    throw new Error("Error al enviar el correo");
  }
}

// Definición del tipo de parámetros
interface RequestParams {
  email: string;
}

export async function PUT(request: Request, { params }: { params: RequestParams }) {
  try {
    const data = await request.json();
    const email = data.emailolvidado;
    const olvido = params.email;
    console.log(data);
    console.log(email);
    console.log(olvido);

    await connectarBD();
    const UsuarioEncontrado = await Usuario.findOne({ email });
    if (!UsuarioEncontrado) {
      return NextResponse.json(
        {
          message: "Ese correo no está registrado",
        },
        {
          status: 409,
        }
      );
    }

    // Generar un código aleatorio de 8 caracteres
    const codigo = Math.random().toString(36).substring(2, 10);
    console.log(codigo);

    const contracifrada = await bcrypt.hash(codigo, 12);
    const usuarioguardado = await Usuario.findOneAndUpdate(
      { email: email },
      { password: contracifrada },
      { new: true } // Opción para devolver el documento actualizado
    );

    // Llamar a la función de enviar el correo
    await enviarCorreo(email, codigo);
    console.log(usuarioguardado);
    return NextResponse.json(usuarioguardado);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error interno del servidor ",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
