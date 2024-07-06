import mongoose, { Schema, InferSchemaType, model } from 'mongoose';

const scheduleSchema = new Schema({
    name: { type: String, required: true },
    guards: [{ type: mongoose.Types.ObjectId, ref: 'User' }], 
    shifts: [{ type: mongoose.Types.ObjectId, ref: 'Shift' }], 
    positions: [{ type: String, required: true }],
    shift_time: { type: Number, required: true }, 
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

type Schedule = InferSchemaType<typeof scheduleSchema>;
type ScheduleWithId = { _id: mongoose.Types.ObjectId } & Schedule;
const scheduleModel = model("Schedule", scheduleSchema);

export { Schedule, ScheduleWithId, scheduleModel, scheduleSchema };
