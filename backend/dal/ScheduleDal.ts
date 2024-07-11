//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { Schedule, ScheduleWithId, ScheduleModel } from '../db/models/schedule'
import { Shift, GuardAssignment } from '../db/models/shift'

export class ScheduleDal {
  createSchedule = async (schedule: Partial<Schedule>) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (!ScheduleModel.collection) {
        await ScheduleModel.createCollection()
      }

      const data = await ScheduleModel.create(schedule)
      await mongoose.disconnect()

      return { success: true, data, msg: 'Schedule has been created' }
    } catch (error) {
      throw error
    }
  }

  getScheduleById = async (id: mongoose.Types.ObjectId) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected')
      }

      const data = await ScheduleModel.findById(id).exec()
      if (data != null) {
        return { success: true, data, msg: 'user retrived by id' }
      } else {
        throw 'User not exist'
      }
    } catch (error) {
      console.error('Error in getUser:', error)
      throw error // Re-throw the error for handling in caller function
    }
  }

  updateSchedule = (
    id: mongoose.Types.ObjectId,
    updatedUserData: Partial<Schedule>
  ) => {
    return new Promise<ScheduleWithId>((resolve, reject) => {
      mongoose
        .connect(process.env.DATABASE_URL as string)
        .then(async () => {
          try {
            const updatedUser = await ScheduleModel.findByIdAndUpdate(
              id,
              updatedUserData,
              { new: true }
            )
            if (!updatedUser) {
              reject('User not found')
            }
            resolve(updatedUser as ScheduleWithId)
          } catch (err) {
            reject(err)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  deleteSchedule = (id: mongoose.Types.ObjectId) => {
    return new Promise<void>(async (resolve, reject) => {
      mongoose.connect(process.env.DATABASE_URL as string).then(async () => {
        await ScheduleModel.findByIdAndDelete(id)
          .exec()
          .catch(err => {
            if (err) {
              reject(err)
            }
          })
        resolve()
      })
    })
  }
}
