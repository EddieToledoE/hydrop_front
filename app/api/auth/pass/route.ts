import { NextResponse } from "next/server";
import Usuario from "@/models/user";
import bcrypt from "bcryptjs";
import { connectarBD } from "@/libs/mongodb";
// Importar Nodemailer
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
async function enviarCorreo(email, codigo) {
  try {
    const mailOptions = {
      from: "Soporte Hydrop :  <" + process.env.EMAIL_USER + ">",
      to: [email, "teddyrepollo@gmail.com"],
      subject: "Contraseña olvidada",
      text:
        "Hydrop" +
        "\n Hola : " +
        email +
        "\n su codigo es: " +
        codigo +
        "\n Puede modificar su contraseña posteriormente dentro de la app " +
        "\n Gracias por confiar en nosotros",
    };

    // Enviar el correo sin el callback, aprovechando async/await
    const correo = await transporter.sendMail(mailOptions);

    console.log("Correo enviado correctamente");
    return NextResponse.json(correo);
  } catch (error) {
    console.error("Error al enviar el correo", error);
    return NextResponse.json(error);
  }
}

export async function PUT(request, { params }) {
  const data = await request.formData();
  const email = data.get("emailolvidado");
  const olvido = params.email;
  console.log(data);
  console.log(email);
  console.log(olvido);
  try {
    await connectarBD();
    const UsuarioEncontrado = await Usuario.findOne({ email });
    if (!UsuarioEncontrado)
      return NextResponse.json(
        {
          message: "Ese correo no esta registrado",
        },
        {
          status: 409,
        }
      );
    // Generar un número aleatorio entre 0 y 1
    let numero = Math.random();
    // Convertir el número a una cadena en base 36
    let cadena = numero.toString(36);
    // Recortar la cadena para obtener los primeros 8 caracteres después del punto
    let codigo = cadena.substring(2, 10);
    // Devolver el código generado
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
    console.log(error);
    return NextResponse.error();
  }
}
