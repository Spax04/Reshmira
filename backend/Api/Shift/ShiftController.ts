import * as bodyParser from 'koa-bodyparser'
import { ShiftService } from './ShiftService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendConfirmEmail
} from '../../utils/intex'
import * as bcrypt from 'bcryptjs'
import { User } from '../../db/models/user'
import * as jwt from 'jsonwebtoken'

export const ShiftController = (router: any) => {
  router.post('/shift/create', bodyParser(), createShift)
}

export async function createShift (ctx: any): Promise<any> {
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

