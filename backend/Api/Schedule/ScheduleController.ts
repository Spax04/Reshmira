import * as bodyParser from 'koa-bodyparser'
import { ScheduleService } from './ScheduleService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendConfirmEmail
} from '../../utils/intex'
import * as bcrypt from 'bcryptjs'
import { User } from '../../db/models/user'
import * as jwt from 'jsonwebtoken'
import { Schedule } from '../../db/models/schedule'
import mongoose from 'mongoose'
import { ScheduleDal } from '../../dal/ScheduleDal'

interface CreateScheduleRequestBody {
  scheduleName: string
  guards: string[]
  positions: { position_name: string; guards_pre_position: number }[]
  shiftTime: number // epoch format (seconds)
  guardsPreShift: number
}

export const ScheduleController = (router: any) => {
  router.post('/schedule/create', bodyParser(), createSchedule)
}

export async function createSchedule (ctx: any): Promise<any> {
  try {
    const { scheduleName, guards, positions, shiftTime, guardsPreShift } = ctx
      .request.body as CreateScheduleRequestBody

    const guardsIds = guards.map(u => new mongoose.Types.ObjectId(u))
    const newSchedule: Partial<Schedule> = {
      name: scheduleName,
      guards: guardsIds,
      shifts: null,
      positions: positions.map(p => p.position_name),
      guards_pre_shift: guardsPreShift,
      shift_time: shiftTime
    }

    const newScheduleResponse = await new ScheduleDal().createSchedule(
      newSchedule
    )

    if (!newScheduleResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Running into the problem while creating schedule. Try again.'
      })
      ctx.status = 500
    }

    const fullSchedule = await new ScheduleService().generateNewSchedule(
      newScheduleResponse.data._id.toString(),
      guardsPreShift,
      guardsIds,
      positions,
      shiftTime
    )

    if(fullSchedule.success){
      ctx.body = JSON.stringify({
        success: true,
        msg: 'New schedule was created successfuly!',
        data: fullSchedule.data
      })
      ctx.status = 404
    }
  } catch (err) {
    console.error('Error in Sign In', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Running into the problem while creating schedule. Try again.'
    })
    ctx.status = 404
  }
}
