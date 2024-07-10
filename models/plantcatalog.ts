import { Schema, model, models, Document, Model } from "mongoose";

interface IPlantCatalog extends Document {
    name: string;
    optimal_temp: number;
    optimal_humidity: number;
    optimal_ph: number;
    optimal_ec: number;
    harvest_days: number; 
}

const PlantCatalogSchema: Schema<IPlantCatalog> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Nombre necesario"],
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        optimal_temp: {
            type: Number,
            required: true
        },
        optimal_humidity: {
            type: Number,
            required: true
        },
        optimal_ph: {
            type: Number,
            required: true
        },
        optimal_ec: {
            type: Number,
            required: true
        },
        harvest_days: {
            type: Number,
            required: [true, "Días de cosecha necesarios"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const PlantCatalog: Model<IPlantCatalog> = models.PlantCatalog || model<IPlantCatalog>("PlantCatalog", PlantCatalogSchema);

export default PlantCatalog;
