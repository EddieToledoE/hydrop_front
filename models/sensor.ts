import { Schema, model, models, Document, Model } from "mongoose";

interface ISensor extends Document {
    type: 'temperature_humidity' | 'water_temp' | 'ph' | 'ec' | 'water_level';
    location: string;
    readings: {
        type: 'temperature' | 'humidity' | 'water_temp' | 'ph' | 'ec' | 'water_level';
        timestamp: Date;
        value: number;
    }[];
}

const SensorSchema: Schema<ISensor> = new Schema(
    {
        type: {
            type: String,
            enum: ['temperature_humidity', 'water_temp', 'ph', 'ec', 'water_level'],
            required: [true, "Tipo de sensor necesario"]
        },
        location: {
            type: String,
            required: [true, "Ubicación necesaria"],
            maxlength: [100, "La ubicación no puede exceder 100 caracteres"]
        },
        readings: [{
            type: {
                type: String,
                enum: ['temperature', 'humidity', 'water_temp', 'ph', 'ec', 'water_level'],
                required: true
            },
            timestamp: {
                type: Date,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        }],
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Sensor: Model<ISensor> = models.Sensor || model<ISensor>("Sensor", SensorSchema);

export default Sensor;
