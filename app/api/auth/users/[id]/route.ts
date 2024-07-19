import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectarBD } from "@/libs/mongodb";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  const { id, email, password, name } = await request.json();

  try {
    await connectarBD();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          {
            message: "La contraseña debe tener al menos 8 caracteres",
          },
          {
            status: 400,
          }
        );
      }
      user.password = await bcrypt.hash(password, 12);
    }

    if (name) {
      user.name = name;
    }

    const updatedUser = await user.save();

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
