import { Schema, model, models, Document, Model } from "mongoose";

interface IUsuario extends Document {
    email: string;
    password: string;
    name: string;
}

const UsuarioSchema: Schema<IUsuario> = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email necesario"],
            unique: true,
            validate: {
                validator: function (value: string) {
                    const emailPattern = /@(gmail\.com|hotmail\.com|outlook\.es|mirandaytoledo\.com)$/i;
                    return emailPattern.test(value);
                },
                message: "El formato del correo electrónico no es válido.",
            },
        },
        password: {
            type: String,
            required: [true, "Contrasena necesaria"],
            minlength: [8, "La contraseña debe tener al menos 8 caracteres."],
        },
        name: {
            type: String,
            required: [true, "Nombre necesario"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Usuario: Model<IUsuario> = models.users || model<IUsuario>("users", UsuarioSchema);

export default Usuario;
