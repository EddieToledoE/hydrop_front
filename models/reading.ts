import { Schema, model, models, Document, Model } from "mongoose";

interface IReading extends Document {
    sensor: Schema.Types.ObjectId;
    timestamp: Date;
    value: number;
}

const ReadingSchema: Schema<IReading> = new Schema(
    {
        sensor: {
            type: Schema.Types.ObjectId,
            ref: 'Sensor',
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Reading: Model<IReading> = models.Reading || model<IReading>("Reading", ReadingSchema);

export default Reading;
