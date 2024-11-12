import mongoose, { Schema, InferSchemaType, model } from 'mongoose'

const guardAssignmentSchema = new Schema({
  position_name: { type: String, required: true },
  guards_pre_position : {type:Number,required: true}
})

// TODO: change shift time to shift time ruls, when you can manage shift time pre day or hours
const ScheduleSchema = new Schema(
  {
    name: { type: String, required: true },
    guards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
    guards_pre_shift: { type: Number, required: true },
    positions: [guardAssignmentSchema],
    shift_time: { type: Number, required: true },
    suspend_guards:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}]
  },
  {
    timestamps: true // This adds `createdAt` and `updatedAt` fields automatically
  }
)

type Schedule = InferSchemaType<typeof ScheduleSchema> & {
  createdAt?: Date 
  updatedAt?: Date 
  shifts?: mongoose.Types.ObjectId[]; 
  suspend_guards?: mongoose.Types.ObjectId[]; 
}
type ScheduleWithId = { _id: mongoose.Types.ObjectId } & Schedule
const ScheduleModel = model('Schedule', ScheduleSchema)

export { Schedule, ScheduleWithId, ScheduleModel, ScheduleSchema }
