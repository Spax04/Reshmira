import mongoose, { Schema, InferSchemaType, model } from 'mongoose'


const roomSchema = new Schema({
  secret: { type: String, required: true },
  users: { type: Boolean, default: false }, 
  adminId: { type: String, enum: ['admin', 'guest'], default: 'guest' },
  schedule_id: { type: String, required: false },
  shifts: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

type Room = InferSchemaType<typeof roomSchema>
type RoomWithId = Room & {
  _id: mongoose.Types.ObjectId
}
const RoomModel = model('Room', roomSchema)

export { Room, RoomModel, roomSchema, RoomWithId }
