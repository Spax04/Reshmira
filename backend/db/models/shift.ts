import mongoose, { Schema, InferSchemaType, model } from 'mongoose'

const guardAssignmentSchema = new Schema({
  guards_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  position_name: { type: String, required: true },
  guards_pre_position : {type:Number,required: true}
})

const ShiftSchema = new Schema({
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  schedule_id: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
  guard_posts: [guardAssignmentSchema] // Array of guard assignments
})

type GuardAssignment = InferSchemaType<typeof guardAssignmentSchema>
type Shift = InferSchemaType<typeof ShiftSchema>
type ShiftWithId = { _id: mongoose.Types.ObjectId } & Shift
const ShiftModel = model('Shift', ShiftSchema)

export { GuardAssignment, Shift, ShiftWithId, ShiftModel, ShiftSchema,guardAssignmentSchema }
