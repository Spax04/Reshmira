import mongoose, { Schema, InferSchemaType, model } from 'mongoose'

const ScheduleSchema = new Schema(
  {
    name: { type: String, required: true },
    guards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
    guards_pre_shift: { type: Number, required: true },
    positions: [{ type: String, required: true }],
    shift_time: { type: Number, required: true }
  },
  {
    timestamps: true // This adds `createdAt` and `updatedAt` fields automatically
  }
)

type Schedule = InferSchemaType<typeof ScheduleSchema> & {
  createdAt?: Date // Make these fields optional
  updatedAt?: Date // Make these fields optional
}
type ScheduleWithId = { _id: mongoose.Types.ObjectId } & Schedule
const ScheduleModel = model('Schedule', ScheduleSchema)

export { Schedule, ScheduleWithId, ScheduleModel, ScheduleSchema }
