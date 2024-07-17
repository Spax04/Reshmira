import * as bodyParser from 'koa-bodyparser'
import { AuthService } from './AuthService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendConfirmEmail
} from '../../utils/intex'
import * as bcrypt from 'bcryptjs'
import { User } from '../../db/models/user'
import * as jwt from 'jsonwebtoken'
import { UserDal } from '../../dal/UserDal'

export const AuthController = (router: any) => {
  router.post('/auth/login', bodyParser(), login)
  router.post('/auth/signup', bodyParser(), signup)
  router.get('/auth/varify-email/:token', bodyParser(), confirmEmail)
}

export async function login (ctx: any): Promise<any> {
  try {
    const { email, password } = ctx.request.body
    const { success, msg, data } = await new UserDal().getUserByEmail(email)

    if (success) {
      if (!data.confirmed) {
        ctx.body = JSON.stringify({
          success: false,
          msg: 'Email is not confirmed'
        })
        ctx.status = 401
      }

      const authenticateResponse = await new AuthService().authenticate(
        password,
        data
      )

      if (!authenticateResponse.success) {
        ctx.body = JSON.stringify({
          success: false,
          msg: authenticateResponse.msg
        })
        ctx.status = 500
        return
      } else {
        ctx.body = JSON.stringify({
          success: true,
          msg: authenticateResponse.msg,
          data: authenticateResponse.data
        })
        ctx.status = 200
        return
      }
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: msg
      })
      ctx.status = 404
    }
  } catch (err) {
    console.error('Error in Sign In', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'User with this email does not exist: ' + err
    })
    ctx.status = 500
  }
}

export async function signup (ctx: any): Promise<any> {
  try {
    const { email, password,fullName } = ctx.request.body

    const createdUserResponse = await new AuthService().registrateNewUser(
      email,
      password,
      fullName
    )
    if (!createdUserResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: createdUserResponse.msg
      })
      ctx.status = 403
    }

    const varificationLink = `${
      process.env.BASE_URL
    }/auth/varify-email/${generateAccessToken(createdUserResponse.data)}`
    const sendVarificationEmailResponse =
      await new AuthService().sendConfirmEmail(
        email,
        'Verify email',
        varificationLink
      )

    if (sendVarificationEmailResponse.success) {
      ctx.body = JSON.stringify({
        success: true,
        msg: sendVarificationEmailResponse.msg
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: sendVarificationEmailResponse.msg
      })
      ctx.status = 500
    }
  } catch (err) {
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error: ' + err.message
    })
    ctx.status = 500
  }
}

export async function confirmEmail (ctx: any): Promise<any> {
  console.log('in confirm')
  const { token } = ctx.request.params // Assuming token is passed as a URL parameter
  try {
    const confirmResponse = await new AuthService().confirmValidationEmail(
      token
    )

    if (confirmResponse.success) {
      ctx.body = JSON.stringify({
        success: true,
        msg: confirmResponse.msg
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: confirmResponse.msg
      })
      ctx.status = confirmResponse.code
    }
  } catch (err) {
    console.error('Error in Email Verification', err)
    ctx.status = 500
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error: ' + err.message
    })
  }
}
