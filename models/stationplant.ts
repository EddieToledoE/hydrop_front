import { Schema, model, models, Document, Model } from "mongoose";

interface IStationPlant extends Document {
    system_id: Schema.Types.ObjectId;
    plant_id: Schema.Types.ObjectId;
    status: 'growing' | 'harvested';
    date_planted: Date;
    estimated_harvest_date: Date;
}

const StationPlantSchema: Schema<IStationPlant> = new Schema(
    {
        system_id: {
            type: Schema.Types.ObjectId,
            ref: 'HydroponicSystem',
            required: true
        },
        plant_id: {
            type: Schema.Types.ObjectId,
            ref: 'PlantCatalog',
            required: true
        },
        status: {
            type: String,
            enum: ['growing', 'harvested'],
            required: true,
            default: 'growing'
        },
        date_planted: {
            type: Date,
            required: true
        },
        estimated_harvest_date: {
            type: Date,
            required: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const StationPlant: Model<IStationPlant> = models.StationPlant || model<IStationPlant>("StationPlant", StationPlantSchema);

export default StationPlant;
