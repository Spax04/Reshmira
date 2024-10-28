import * as bodyParser from 'koa-bodyparser'
import { ShiftService } from './ShiftService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendEmail
} from '../../utils/intex'
import * as bcrypt from 'bcryptjs'
import { User } from '../../db/models/user'
import * as jwt from 'jsonwebtoken'
import { ShiftDal } from '../../dal/ShiftDal'
import mongoose from 'mongoose';

export const ShiftController = (router: any) => {
  router.post('/shift/create', bodyParser(), createShift)
  router.post('/shift/get-list', bodyParser(), getShiftsList)
}

export async function createShift(ctx: any): Promise<any> {
  try {
    const { scheduleName, guards, positions, shiftTime } = ctx.request.body

  } catch (err) {
    console.error('Error in Sign In', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Running into the problem while creating schedule. Try again.'
    })
    ctx.status = 404
  }
}
interface RequestBody {
  shiftsIds: string[]; // Define shiftsIds as an array of strings
}

export async function getShiftsList(ctx: any): Promise<any> {
  try {
    const { shiftsIds } = ctx.request.body  as RequestBody
    const objectIds = shiftsIds.map(id => new mongoose.Types.ObjectId(id));

    const response = await new ShiftDal().getShiftsList(objectIds)

    const updatedList = await new ShiftService().addGuardDataToShift(response.data)
    console.log(response);
    ctx.body = JSON.stringify({
      success: true,
      data: updatedList
    })
    ctx.status = 200
  } catch (err) {
    console.error('Error in Sign In', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Running into the problem while creating schedule. Try again.'
    })
    ctx.status = 404
  }
}


