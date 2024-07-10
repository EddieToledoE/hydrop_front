import { Schema, model, models, Document, Model } from "mongoose";

interface IActuator extends Document {
    type: 'pump' | 'nutrient_dispenser';
    status: 'on' | 'off';
}

const ActuatorSchema: Schema<IActuator> = new Schema(
    {
        type: {
            type: String,
            enum: ['pump', 'nutrient_dispenser'],
            required: [true, "Tipo de actuador necesario"]
        },
        status: {
            type: String,
            enum: ['on', 'off'],
            required: [true, "Estado necesario"]
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Actuator: Model<IActuator> = models.Actuator || model<IActuator>("Actuator", ActuatorSchema);

export default Actuator;
