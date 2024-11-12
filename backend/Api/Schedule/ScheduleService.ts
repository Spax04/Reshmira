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
    positions: { position_name: string; guards_pre_position: number }[],
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

          for (let j = 0; j < positions[i].guards_pre_position; j++) {
            let guardId = guards.shift()
            if (guardId) {
              guardsIds.push(guardId)
              guards.push(guardId)
            }
          }

          const newGuardPost: GuardAssignment = {
            guards_id: guardsIds,
            position_name: positions[i].position_name,
            guards_pre_position: positions[i].guards_pre_position
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

  extendExistingSchedule = async (scheduleId: mongoose.Types.ObjectId, extendDays: number) => {
    try {


      const { success: scheduleByIdSuccess, data: scheduleByIdData, msg: scheduleByIdMsg } = await new ScheduleDal().getScheduleById(scheduleId)

      if (!scheduleByIdSuccess) {
        return { success: scheduleByIdSuccess, msg: scheduleByIdMsg }
      }

      const currentDate = new Date().getTime()

      let { data: shiftsList } = await new ShiftDal().getShiftsList(scheduleByIdData.shifts)

      shiftsList.sort(function (a, b) {

        return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
      })

      // Getting not expired shifts and makin updated shifts array
      const notExpiredShifts = shiftsList.filter((s) => new Date(s.end_time).getTime()! < currentDate)
      const updatedScheduleShifts = []
      notExpiredShifts.forEach(s => updatedScheduleShifts.push(s._id))

      // getting expired shift to delete later
      const expiredShifts = shiftsList.filter((s) => new Date(s.end_time).getTime()! > currentDate)
      const expiredScheduleShifts : any = []
      expiredShifts.forEach(s => expiredScheduleShifts.push(s._id))


      const lastShift = shiftsList[shiftsList.length - 1]
     
      const lastGuardId = lastShift.guard_posts[lastShift.guard_posts.length -1].guards_id[lastShift.guard_posts[lastShift.guard_posts.length -1].guards_id.length -1]
      // make sorting that first in the list will be last guard that was in shedule
      while(scheduleByIdData.guards[0]._id !== lastGuardId){
        let guardId = scheduleByIdData.guards.shift()
            if (guardId) {
              scheduleByIdData.guards.push(guardId)
            }
      }
      
      console.log("Schedule start current start time");
      let currentDateEpoch = Math.floor(lastShift.end_time.getTime() / 1000)
      console.log(currentDateEpoch);
      let threeDaysSinceStart = Math.floor(
        (currentDateEpoch + extendDays * 24 * 60 * 60)
      )
      while (currentDateEpoch < threeDaysSinceStart) {
        const startDate = new Date(currentDateEpoch * 1000)
        const endDate = new Date((currentDateEpoch + scheduleByIdData.shift_time) * 1000)

        const guardPosts: mongoose.Types.DocumentArray<GuardAssignment> =
          new mongoose.Types.DocumentArray([])

        for (let i = 0; i < scheduleByIdData.positions.length; i++) {
          let guardsIds: mongoose.Types.ObjectId[] = []

          for (let j = 0; j < scheduleByIdData.positions[i].guards_pre_position; j++) {
            let guardId = scheduleByIdData.guards.shift()
            if (guardId) {
              guardsIds.push(guardId)
              scheduleByIdData.guards.push(guardId)
            }
          }

          const newGuardPost: GuardAssignment = {
            guards_id: guardsIds,
            position_name: scheduleByIdData.positions[i].position_name,
            guards_pre_position: scheduleByIdData.positions[i].guards_pre_position
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

        updatedScheduleShifts.push(savedShift.data._id)
        currentDateEpoch += scheduleByIdData.shift_time
      }



      const currentScheduleResponse = await new ScheduleDal().getScheduleById(
        new mongoose.Types.ObjectId(scheduleId)
      )

      currentScheduleResponse.data.shifts = [...updatedScheduleShifts]

      const updatedSchedule = await new ScheduleDal().updateSchedule(
        new mongoose.Types.ObjectId(scheduleId),
        currentScheduleResponse.data
      )


      await ShiftModel.deleteMany({ _id: { $in: expiredScheduleShifts } })

      return {
        success: true,
        data: updatedSchedule,
        msg: 'Schedule has been created'
      }
    } catch (error) {
      return {
        success: false,
        msg: error
      }
    }
  }


}
