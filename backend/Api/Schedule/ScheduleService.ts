//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import {
  Schedule,
  ScheduleWithId,
  ScheduleModel
} from '../../db/models/schedule'
import { Shift, GuardAssignment, ShiftModel } from '../../db/models/shift'
import { ScheduleDal } from '../../dal/ScheduleDal'
import { ShiftDal } from '../../dal/ShiftDal'
import { UserDal } from '../../dal/UserDal'

export class ScheduleService {
  generateNewSchedule = async (
    scheduleId: string,
    guardsPreShift: number,
    guards: mongoose.Types.ObjectId[],
    positions: { position_name: string; guard_pre_position: number }[],
    shiftTime: number,// epoch format (seconds)
    scheduleStartDate: number
  ) => {
    try {
      console.log("Schedule start current start time");
      let currentDateEpoch = Math.floor(scheduleStartDate)
      console.log(currentDateEpoch);
      let threeDaysSinceStart = Math.floor(
        (scheduleStartDate + 3 * 24 * 60 * 60)
      )
      const shifts: mongoose.Types.ObjectId[] = []
      while (currentDateEpoch < threeDaysSinceStart) {
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

  deleteScheduleWithShifts = async (id: mongoose.Types.ObjectId) => {

    try {

      const { success: scheduleSuccess, data: scheduleData, msg: scheduleMsg } = await new ScheduleDal().getScheduleById(new mongoose.Types.ObjectId(id))

      if (!scheduleSuccess) {
        return { success: false, msg: scheduleMsg }
      }
      await ShiftModel.deleteMany({ _id: { $in: scheduleData.shifts } })

      await new ScheduleDal().deleteSchedule(id)

      return { success: true, msg: "Schedule with shifts was deleted successfully!" }
    } catch (err) {
      return { success: false, msg: "Error on schedule delete: ", err }
    }
  }


}
