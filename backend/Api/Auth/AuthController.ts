import * as bodyParser from 'koa-bodyparser'
import { AuthService } from './AuthService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendEmail
} from '../../utils/intex'
import * as bcrypt from 'bcryptjs'
import { User } from '../../db/models/user'
import * as jwt from 'jsonwebtoken'
import { UserDal } from '../../dal/UserDal'

export const AuthController = (router: any) => {
  router.post('/auth/login', bodyParser(), login)
  router.post('/auth/signup', bodyParser(), signup)
  router.get('/auth/verify-email/:token', bodyParser(), confirmEmail)
  router.post('/auth/forgot-password/', bodyParser(), forgotPassword)
  router.post('/auth/verify-code/', bodyParser(), verifyCode)
  router.post('/auth/reset-password', bodyParser(), resetPassword)
}

export async function login(ctx: any): Promise<any> {
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
    console.error('Error in Login', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'User with this email does not exist: ' + err
    })
    ctx.status = 500
  }
}

export async function signup(ctx: any): Promise<any> {
  try {
    const { email, password, fullName } = ctx.request.body

    const { success: createUserSucces, data: createUserData, msg: createUserMsg } = await new AuthService().registrateNewUser(email, password, fullName)

    if (!createUserSucces) {
      ctx.body = JSON.stringify({
        success: false,
        msg: createUserMsg
      })
      ctx.status = 403
    }

    console.log("Sending confirm email");
    const { success: varificationEmailSuccess, msg: verificationEmailMsg } = await new AuthService().sendConfirmEmail(createUserData)
    if (varificationEmailSuccess) {
      ctx.body = JSON.stringify({
        success: true,
        msg: verificationEmailMsg
      })
      ctx.status = 200
    } else {
      console.error(verificationEmailMsg);
      ctx.body = JSON.stringify({
        success: false,
        msg: verificationEmailMsg
      })
      ctx.status = 500
    }
  } catch (err) {
    console.error(err.message);
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error: ' + err.message
    })
    ctx.status = 500
  }
}

export async function confirmEmail(ctx: any): Promise<any> {
  console.log('in confirm')
  const { token } = ctx.request.params
  console.log(token);// Assuming token is passed as a URL parameter
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

export async function forgotPassword(ctx: any): Promise<any> {

  const { email } = ctx.request.body
  try {

    const { success: userByEmailSuccess, data: userByEmailData, msg: userByEmailMsg } = await new UserDal().getUserByEmail(email)
    console.log("Got user by email");

    if (!userByEmailSuccess) {
      ctx.body = JSON.stringify({
        success: false,
        msg: userByEmailMsg
      })
      ctx.status = 404
    }
    const { success: sendResetCodeSuccess, msg: sendResetCodeMsg } = await new AuthService().sendResetCode(userByEmailData, email)

    if (sendResetCodeSuccess) {
      ctx.body = JSON.stringify({
        success: true,
        data: { userId: userByEmailData._id },
        msg: sendResetCodeMsg
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: sendResetCodeMsg
      })
      ctx.status = 404
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

export async function verifyCode(ctx: any): Promise<any> {

  const { code, userId } = ctx.request.body
  try {


    const { success: verifyCodeSuccess, msg: verifyCodeMsg } = await new AuthService().verifyResetCode(userId, code)


    if (verifyCodeSuccess) {
      ctx.body = JSON.stringify({
        success: true,
        msg: verifyCodeMsg,
        data: { userId }
      })
      ctx.status = 200
    } else {
      console.log(verifyCodeMsg);
      ctx.body = JSON.stringify({
        success: false,
        msg: verifyCodeMsg
      })
      ctx.status = verifyCodeMsg
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

export async function resetPassword(ctx: any): Promise<any> {

  const { userId, newPassword } = ctx.request.body
  try {


    const { success: resetPasswordSuccess, msg: resetPasswordMsg } = await new AuthService().resetUserPassword(userId, newPassword)


    if (resetPasswordSuccess) {
      ctx.body = JSON.stringify({
        success: true,
        msg: resetPasswordMsg
      })
      ctx.status = 200
    } else {
      console.error(resetPasswordMsg);
      ctx.body = JSON.stringify({
        success: false,
        msg: resetPasswordMsg
      })
      ctx.status = resetPasswordMsg
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
