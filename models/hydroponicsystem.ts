import { Schema, model, models, Document, Model } from "mongoose";

interface IHydroponicSystem extends Document {
    user: Schema.Types.ObjectId;
    name: string;
    city: string;
    plants: Schema.Types.ObjectId[];
    sensors: {
        type: 'temperature' | 'humidity' | 'water_temp' | 'ph' | 'ec' | 'water_level';
        readings: {
            type: 'temperature' | 'humidity' | 'water_temp' | 'ph' | 'ec' | 'water_level';
            timestamp: Date;
            value: number;
        }[];
    }[];
    actuators: {
        type: 'pump' | 'nutrient_dispenser';
        status: 'on' | 'off';
    }[];
}

const HydroponicSystemSchema: Schema<IHydroponicSystem> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: [true, "Nombre necesario"],
            maxlength: [100, "El nombre no puede exceder 100 caracteres"]
        },
        city: {
            type: String,
            required: [true, "Ciudad necesaria"],
            maxlength: [100, "La ciudad no puede exceder 100 caracteres"]
        },
        plants: [{
            type: Schema.Types.ObjectId,
            ref: 'StationPlant'
        }],
        sensors: [{
            type: {
                type: String,
                enum: ['temperature', 'humidity', 'water_temp', 'ph', 'ec', 'water_level'],
                required: [true, "Tipo de sensor necesario"]
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
            }]
        }],
        actuators: [{
            type: {
                type: String,
                enum: ['pump', 'nutrient_dispenser'],
                required: [true, "Tipo de actuador necesario"]
            },
            status: {
                type: String,
                enum: ['on', 'off'],
                required: [true, "Estado necesario"]
            }
        }],
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Middleware to add default sensors and actuators
HydroponicSystemSchema.pre('save', function (next) {
    if (this.isNew) {
        this.sensors = [
            { type: 'temperature', readings: [] },
            { type: 'humidity', readings: [] },
            { type: 'water_temp', readings: [] },
            { type: 'ph', readings: [] },
            { type: 'ec', readings: [] },
            { type: 'water_level', readings: [] }
        ];
        this.actuators = [
            { type: 'pump', status: 'off' },
            { type: 'nutrient_dispenser', status: 'off' }
        ];
    }
    next();
});

const HydroponicSystem: Model<IHydroponicSystem> = models.HydroponicSystem || model<IHydroponicSystem>("HydroponicSystem", HydroponicSystemSchema);

export default HydroponicSystem;
