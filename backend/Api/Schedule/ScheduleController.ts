import * as bodyParser from 'koa-bodyparser';
import { ScheduleService } from './ScheduleService';

import * as bcrypt from 'bcryptjs';
import { User, UserWithId } from '../../db/models/user';
import * as jwt from 'jsonwebtoken';
import { Schedule } from '../../db/models/schedule';
import mongoose, { mongo } from 'mongoose';
import { ScheduleDal } from '../../dal/ScheduleDal';
import { RoomDal } from '../../dal/RoomDal';
import { RoomWithId } from '../../db/models/room';
import { UserDal } from '../../dal/UserDal';
import { RoomService } from '../Room/RoomService';

interface CreateScheduleRequestBody {
  scheduleName: string;
  guards: { _id: mongoose.Types.ObjectId, fullName: string }[];
  positions: { position_name: string; guard_pre_position: number }[];
  shiftTime: number; // epoch format (seconds)
  guardsPreShift: number;
  roomId: string;
  scheduleStartDate: number
}

export const ScheduleController = (router: any) => {
  router.post('/schedule/create', bodyParser(), createSchedule);
  router.get('/schedule/:id', bodyParser(), getScheduleById)
  router.delete("/schedule/:scheduleId/:roomId", bodyParser(), deleteSchedule)
  router.post("/schedule/extend", bodyParser(), extendSchedule)
};

export async function getScheduleById(ctx: any): Promise<any> {

  const { id } = ctx.request.params
  console.log(id)
  console.log("INSIDE")
  try {
    const { success: scheduleSuccess, data: scheduleData, msg: scheduleMsg } = await new ScheduleDal().getScheduleById(new mongoose.Types.ObjectId(id))
    console.log("after getting schedule by id")

    if (scheduleSuccess) {

      const objectIds = scheduleData.guards.map(id => new mongoose.Types.ObjectId(id));

      const response = await new UserDal().getUsersList(objectIds)

      let updatedGuards: any = []
      response.data.forEach(guard => updatedGuards.push({ _id: guard._id, fullName: guard.full_name }))

      console.log("UPDATED GUARDS");
      console.log(updatedGuards);
      let updatedSchedule: any = JSON.parse(JSON.stringify(scheduleData)); // Deep copy
      updatedSchedule.guards = updatedGuards
      console.log("UPDATED SCHEDULE");
      console.log(updatedSchedule);
      ctx.body = JSON.stringify({
        success: true,
        msg: 'Schedule retreived successfuly!',
        data: updatedSchedule
      });
      ctx.status = 200;
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: scheduleMsg
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


export async function createSchedule(ctx: any): Promise<any> {
  try {
    const { scheduleName, guards, positions, shiftTime, guardsPreShift, roomId, scheduleStartDate } = ctx
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

    const shiftTimeString = typeof shiftTime === 'string' ? shiftTime : shiftTime.toString(); 

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
      shiftTimeInSeconds,
      scheduleStartDate
    );


    const { data: roomResponse } = await new RoomDal().getRoomById(new mongoose.Types.ObjectId(roomId))

    const updatedRoomData: Partial<RoomWithId> = {
      ...roomResponse,
      schedule_id: newScheduleResponse.data._id,
      users: roomResponse.users.map(u => u._id)
    };

    await new RoomDal().updateRoom(new mongoose.Types.ObjectId(roomId), updatedRoomData)

    console.log("After generating schedule");
    if (fullSchedule.success) {
      console.log(fullSchedule);
      console.log(fullSchedule.data);
      console.log("Schedule was created successfully!");

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

export async function deleteSchedule(ctx: any): Promise<any> {

  const { scheduleId, roomId } = ctx.request.params
  console.log(scheduleId)
  console.log(roomId);

  try {
    const { success: deleteScheduleSucces, msg: deleteScheduleMsg } = await new ScheduleService().deleteScheduleWithShifts(new mongoose.Types.ObjectId(scheduleId))

    if (!deleteScheduleSucces) {


      ctx.body = JSON.stringify({
        success: false,
        msg: deleteScheduleMsg
      });
      ctx.status = 400;
    }

    const { success: roomByIdSuccess, data: roomByIdData, msg: roomByIdMsg } = await new RoomDal().getRoomById(new mongoose.Types.ObjectId(roomId))

    if (!roomByIdSuccess) {

      ctx.body = JSON.stringify({
        success: false,
        msg: roomByIdMsg
      });
      ctx.status = 400;
    }

    const { success: deleteRoomByIdSuccess, msg: deleteRoomByIdMsg } = await new RoomService().deleteRoom(roomId)

    if (!deleteRoomByIdSuccess) {

      ctx.body = JSON.stringify({
        success: false,
        msg: deleteRoomByIdMsg
      });
      ctx.status = 400;
    }


    ctx.body = JSON.stringify({
      success: true,
      msg: "Schedule was deleted Successfully!"
    });
    ctx.status = 200;

  } catch (err) {
    console.error('Error in Sign In', err);
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Running into the problem while creating schedule. Try again.',
    });
    ctx.status = 404;
  }
}

interface ExtendScheduleRequestBody {
  scheduleId: string;
  extendDays: number;
}

export async function extendSchedule(ctx: any): Promise<any> {
  try {
    const { scheduleId, extendDays } = ctx
      .request.body as ExtendScheduleRequestBody;

    

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
      shiftTimeInSeconds,
      scheduleStartDate
    );


    const { data: roomResponse } = await new RoomDal().getRoomById(new mongoose.Types.ObjectId(roomId))

    const updatedRoomData: Partial<RoomWithId> = {
      ...roomResponse,
      schedule_id: newScheduleResponse.data._id,
      users: roomResponse.users.map(u => u._id)
    };

    await new RoomDal().updateRoom(new mongoose.Types.ObjectId(roomId), updatedRoomData)

    console.log("After generating schedule");
    if (fullSchedule.success) {
      console.log(fullSchedule);
      console.log(fullSchedule.data);
      console.log("Schedule was created successfully!");

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

