//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { Room, RoomModel, RoomWithId } from '../../db/models/room'
import { generateRoomCode } from '../../utils/intex'

export class RoomService {
  createRoom = async (adminId: string) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (!RoomModel.collection) {
        await RoomModel.createCollection()
      }

      let secret = await generateRoomCode()

      let response = await this.getRoomBySecret(secret)

      while (!response.success) {
        secret = await generateRoomCode()
        response = await this.getRoomBySecret(secret)
      }

      const newRoom: Room = {
        secret: secret,
        users: [],
        adminId: new mongoose.Types.ObjectId(adminId),
        shifts: [],
        created_at: new Date(),
        updated_at: new Date(),
        schedule_id: null
      }
      const data = await RoomModel.create(newRoom)
      await mongoose.disconnect()

      return { success: true, data, msg: 'login OK' }
    } catch (error) {
      throw error
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
        throw 'Room does not exist'
      }
    } catch (error) {
      console.error('Error in getRoomById:', error)
      throw error // Re-throw the error for handling in caller function
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
      return { success: true, data, msg: 'Room retrived by secret' }
    } catch (error) {
      console.error('Error in getUserBySecret:', error)
      return { success: false, msg: 'Room with provided secret does not exist' }
    }
  }

  updateRoom = async (
    id: mongoose.Types.ObjectId,
    updatedRoomData: Partial<Room>
  ): Promise<any> => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        id,
        updatedRoomData,
        { new: true }
      ).exec()

      

      await mongoose.disconnect()
      return {
        success: true,
        data: updatedRoom as RoomWithId,
        msg: 'Room was updated successfuly'
      }
    } catch (err) {
      console.error('Error in updateRoom:', err)
      return {
        success: false,
        msg: 'Running in problem on user update: ' + err
      }
    }
  }

  deleteRoom = async (id: mongoose.Types.ObjectId): Promise<any> => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      const deletedRoom = await RoomModel.findByIdAndDelete(id).exec()

      if (!deletedRoom) {
        return {
          success: false,
          msg: 'Room not found'
        }
      }

      await mongoose.disconnect()
      return {
        success: true,
        msg: 'Room deleted successful'
      }
    } catch (err) {
      return {
        success: true,
        msg: 'Running in problem in room delete: ' + err
      }
    }
  }
}
