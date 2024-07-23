import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectarBD } from "@/libs/mongodb";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  const { userId, email, password, name } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { message: "Falta el parámetro userId" },
      { status: 400 }
    );
  }

  if (!email && !password && !name) {
    return NextResponse.json(
      { message: "Falta al menos un campo para actualizar (email, password, name)" },
      { status: 400 }
    );
  }

  try {
    await connectarBD();

    const updateData: { [key: string]: any } = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ message: "Usuario actualizado correctamente", updatedUser });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
