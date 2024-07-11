import mongoose, { Schema, InferSchemaType, model } from 'mongoose'


const roomSchema = new Schema({
  secret: { type: String, required: true },
  users:  [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schedule_id:  { type: Schema.Types.ObjectId, ref: 'Schedule' },
  shifts:  [{ type: Schema.Types.ObjectId, ref: 'Shift' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

type Room = InferSchemaType<typeof roomSchema>
type RoomWithId = Room & {
  _id: mongoose.Types.ObjectId
}
const RoomModel = model('Room', roomSchema)

export { Room, RoomModel, roomSchema, RoomWithId }
