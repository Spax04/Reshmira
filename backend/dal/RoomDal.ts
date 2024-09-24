//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { Room, RoomModel, RoomWithId } from '../db/models/room'
interface UpdateRoomResponse {
  success: boolean
  data?: RoomWithId | null
  msg: string
}
export class RoomDal {
  createRoom = async (roomData: Room) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (!RoomModel.collection) {
        await RoomModel.createCollection()
      }

      const data: RoomWithId = await RoomModel.create(roomData)

      return {
        success: true,
        data,
        msg: `Room with id ${data._id}  has been created`
      }
    } catch (error) {
      return { success: false, msg: 'User creation error: ' + error }
    } finally {
      await mongoose.disconnect()
    }
  }

  getRoomById = async (id: mongoose.Types.ObjectId) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected')
      }

      const data = await RoomModel.findById(id).exec()
      if (data != null) {
        return { success: true, data, msg: 'Room retrived by id' }
      } else {
        throw 'Room not exist'
      }
    } catch (error) {
      console.error('Error in getRoomById:', error)
      throw error
    } finally {
      await mongoose.disconnect()
    }
  }

  getRoomBySecret = async (secret: String) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected')
      }

      const data: RoomWithId = await RoomModel.findOne({
        secret: secret
      }).exec()
      return { success: true, data, msg: 'Room retrived by secret.' }
    } catch (error) {
      console.error('Error in getRoomBySecret', error)
      throw error // Re-throw the error for handling in caller function
    } finally {
      await mongoose.disconnect()
    }
  }

  updateRoom = async (
    id: mongoose.Types.ObjectId,
    updatedRoomData: Partial<RoomWithId>
  ): Promise<UpdateRoomResponse> => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        id,
        updatedRoomData,
        {
          new: true
        }
      )

      if (!updatedRoom) {
        return { success: false, msg: 'User not found' }
      }

      return {
        success: true,
        data: updatedRoom,
        msg: `Room, with id ${updatedRoom._id}, has been updated`
      }
    } catch (err) {
      return { success: false, msg: 'Error: ' + (err as Error).message }
    } finally {
      await mongoose.disconnect()
    }
  }

  deleteRoom = async (id: mongoose.Types.ObjectId) => {
    try {
      mongoose.connect(process.env.DATABASE_URL as string).then(async () => {
        await RoomModel.findByIdAndDelete(id).exec()
      })

      return { success: true, msg: 'Room was deleted sucessfuly' }
    } catch (err) {
      return { success: false, msg: 'Error on deliting room!' }
    } finally {
      mongoose.disconnect()
    }
  }
}
