import { Schema, model, models, Document, Model } from "mongoose";

export interface IPlantGroup extends Document {
    name: string;
    optimal_temp: { min: number, max: number };
    optimal_humidity: { min: number, max: number };
    optimal_ph: { min: number, max: number };
    optimal_ec: { min: number, max: number };
}

const PlantGroupSchema: Schema<IPlantGroup> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Nombre del grupo necesario"],
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        optimal_temp: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        optimal_humidity: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        optimal_ph: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        optimal_ec: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const PlantGroup: Model<IPlantGroup> = models.PlantGroup || model<IPlantGroup>("PlantGroup", PlantGroupSchema);

export default PlantGroup;
