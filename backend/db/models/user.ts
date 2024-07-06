import mongoose, { Schema, InferSchemaType, model } from 'mongoose'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address']
  },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false }, 
  role: { type: String, enum: ['admin', 'guest','none'], default: 'none' },
  schedule_id: { type: String, required: false },
  shifts: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

type User = InferSchemaType<typeof userSchema>
type UserWithId = User & {
  _id: mongoose.Types.ObjectId
}
const UserModel = model('User', userSchema)

export { User, UserModel, userSchema, UserWithId }
