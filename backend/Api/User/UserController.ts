import * as bodyParser from 'koa-bodyparser'
import { UserService } from './UserService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendConfirmEmail
} from '../../utils/intex'
import * as bcrypt from 'bcryptjs'
import { User } from '../../db/models/user'
import * as jwt from 'jsonwebtoken'
import { UserDal } from '../../dal/UserDal'

export const UserController = (router: any) => {
  router.post('/user', bodyParser(), getSelf)
  router.post('/user/update', bodyParser(), updateUserDetails)
}

export async function getSelf (ctx: any): Promise<any> {
  try {
    const { token } = ctx.request.body

    const userDataResponse = await new UserService().retriveUserByToken(token)

    if (!userDataResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: userDataResponse.msg
      })
      ctx.status = 404
      return
    } else {
      ctx.body = JSON.stringify({
        success: true,
        msg: userDataResponse.msg,
        data: userDataResponse.data
      })
      ctx.status = 200
      return
    }
  } catch (err) {
    console.error('Error retieving User data', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Error retieving User data ' + err
    })
    ctx.status = 500
  }
}

export async function updateUserDetails (ctx: any): Promise<any> {
  try {
    
  } catch (err) {
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error: ' + err.message
    })
    ctx.status = 500
  }
}
