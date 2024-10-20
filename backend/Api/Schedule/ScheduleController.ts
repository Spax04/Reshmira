import * as bodyParser from 'koa-bodyparser';
import { ScheduleService } from './ScheduleService';

import * as bcrypt from 'bcryptjs';
import { User } from '../../db/models/user';
import * as jwt from 'jsonwebtoken';
import { Schedule } from '../../db/models/schedule';
import mongoose from 'mongoose';
import { ScheduleDal } from '../../dal/ScheduleDal';

interface CreateScheduleRequestBody {
  scheduleName: string;
  guards: { _id: mongoose.Types.ObjectId, fullName: string }[];
  positions: { position_name: string; guard_pre_position: number }[];
  shiftTime: number; // epoch format (seconds)
  guardsPreShift: number;
}

export const ScheduleController = (router: any) => {
  router.post('/schedule/create', bodyParser(), createSchedule);
};

export async function createSchedule(ctx: any): Promise<any> {
  try {
    const { scheduleName, guards, positions, shiftTime, guardsPreShift } = ctx
      .request.body as CreateScheduleRequestBody;

    console.log("Schedule name: " + scheduleName);
    console.log("positions: " + [...positions]);
    console.log("Guards: " + [...guards]);
    console.log("Shift time: " + shiftTime);
    console.log("Guards pre shift: " + guardsPreShift);

    console.log("Start!");

    const guardsIds = guards.map(u => u._id = new mongoose.Types.ObjectId(u._id));
    const timeToSeconds = (timeString: string): number => {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 3600 + minutes * 60;
    };

    // Ensure shiftTime is a string, then convert to seconds
    const shiftTimeString = typeof shiftTime === 'string' ? shiftTime : shiftTime.toString(); // Convert shiftTime to string if necessary

    const shiftTimeInSeconds = timeToSeconds(shiftTimeString);
    const newSchedule: Partial<Schedule> = {
      name: scheduleName,
      guards: guardsIds,
      shifts: null,
      positions: positions.map(p => p.position_name),
      guards_pre_shift: guardsPreShift,
      shift_time: shiftTimeInSeconds,
    };

    console.log("Before creatin schedule");
    const newScheduleResponse = await new ScheduleDal().createSchedule(
      newSchedule
    );

    if (!newScheduleResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Running into the problem while creating schedule. Try again.',
      });
      ctx.status = 500;
    }
    console.log("before generating schedule");
    const fullSchedule = await new ScheduleService().generateNewSchedule(
      newScheduleResponse.data._id.toString(),
      guardsPreShift,
      guardsIds,
      positions,
      shiftTimeInSeconds
    );

    console.log("After generating schedule");
    if (fullSchedule.success) {
      ctx.body = JSON.stringify({
        success: true,
        msg: 'New schedule was created successfuly!',
        data: fullSchedule.data,
      });
      ctx.status = 200;
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Error on creating: ' + fullSchedule.msg,

      });
      ctx.status = 400;
    }
  } catch (err) {
    console.error('Error in Sign In', err);
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Running into the problem while creating schedule. Try again.',
    });
    ctx.status = 404;
  }
}
