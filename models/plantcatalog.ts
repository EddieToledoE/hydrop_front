import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IPlantCatalog extends Document {
    name: string;
    harvest_days: number;
    image: string;
    group_id: Types.ObjectId; // Referencia al grupo de plantas
}

const PlantCatalogSchema: Schema<IPlantCatalog> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Nombre necesario"],
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        harvest_days: {
            type: Number,
            required: [true, "Días de cosecha necesarios"]
        },
        image: {
            type: String,
            required: false
        },
        group_id: {
            type: Schema.Types.ObjectId,
            ref: 'PlantGroup',
            required: [true, "Grupo necesario"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const PlantCatalog: Model<IPlantCatalog> = models.PlantCatalog || model<IPlantCatalog>("PlantCatalog", PlantCatalogSchema);

export default PlantCatalog;
