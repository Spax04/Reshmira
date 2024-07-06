import mongoose, { Schema, InferSchemaType, model } from 'mongoose';

const guardAssignmentSchema = new Schema({
    guard_id: { type: String, required: true },
    position: { type: String, required: true }
});

const shiftSchema = new Schema({
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    schedule_id: { type: String, required: true },
    guards: [guardAssignmentSchema] // Array of guard assignments
});

type GuardAssignment = InferSchemaType<typeof guardAssignmentSchema>;
type Shift = InferSchemaType<typeof shiftSchema>;
type ShiftWithId = { _id: mongoose.Types.ObjectId } & Shift;
const shiftModel = model("Shift", shiftSchema);

export { GuardAssignment, Shift, ShiftWithId, shiftModel, shiftSchema };
