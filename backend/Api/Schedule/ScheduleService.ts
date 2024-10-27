//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import {
  Schedule,
  ScheduleWithId,
  ScheduleModel
} from '../../db/models/schedule'
import { Shift, GuardAssignment } from '../../db/models/shift'
import { ScheduleDal } from '../../dal/ScheduleDal'
import { ShiftDal } from '../../dal/ShiftDal'

export class ScheduleService {
  generateNewSchedule = async (
    scheduleId: string,
    guardsPreShift: number,
    guards: mongoose.Types.ObjectId[],
    positions: { position_name: string; guard_pre_position: number }[],
    shiftTime: number // epoch format (seconds)
  ) => {
    try {
      let currentDateEpoch = Math.floor(Date.now() / 1000)
      let weekFromNowEpoch = Math.floor(
        (Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000
      )
      const shifts: mongoose.Types.ObjectId[] = []
      while (currentDateEpoch < weekFromNowEpoch) {
        const startDate = new Date(currentDateEpoch * 1000)
        const endDate = new Date((currentDateEpoch + shiftTime) * 1000)

        const guardPosts: mongoose.Types.DocumentArray<GuardAssignment> =
          new mongoose.Types.DocumentArray([])

        for (let i = 0; i < positions.length; i++) {
          let guardsIds: mongoose.Types.ObjectId[] = []

          for (let j = 0; j < positions[i].guard_pre_position; j++) {
            let guardId = guards.shift()
            if (guardId) {
              guardsIds.push(guardId)
              guards.push(guardId)
            }
          }

          const newGuardPost: GuardAssignment = {
            guards_id: guardsIds,
            position_name: positions[i].position_name,
            guards_pre_position: positions[i].guard_pre_position
          }

          guardPosts.push(newGuardPost)
        }

        const newShift: Shift = {
          start_time: startDate,
          end_time: endDate,
          schedule_id: new mongoose.Types.ObjectId(scheduleId),
          guard_posts: guardPosts
        }

        const savedShift = await new ShiftDal().createShift(newShift)

        if (!savedShift.success) {
          throw new Error('Error on saving new shift')
        }

        shifts.push(savedShift.data._id)
        currentDateEpoch += shiftTime
      }

      const currentScheduleResponse = await new ScheduleDal().getScheduleById(
        new mongoose.Types.ObjectId(scheduleId)
      )
      currentScheduleResponse.data.shifts = [...shifts]
      const updatedSchedule = await new ScheduleDal().updateSchedule(
        new mongoose.Types.ObjectId(scheduleId),
        currentScheduleResponse.data
      )

      return {
        success: true,
        data: updatedSchedule,
        msg: 'Schedule has been created'
      }
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
