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

export const AuthController = (router: any) => {
  router.post('/auth/login', bodyParser(), login)
  router.post('/auth/signup', bodyParser(), signup)
  router.get('/auth/varify-email/:token', bodyParser(), confirmEmail)
}

export async function login (ctx: any): Promise<any> {
  try {
    const { email, password } = ctx.request.body
    const { success, msg, data } = await new AuthService().getUserByEmail(email)

    if (success) {
      if (data) {
        if (!data.confirmed) {
          ctx.body = JSON.stringify({
            success: false,
            msg: 'Email is not confirmed'
          })
          ctx.status = 401
        }
        if (bcrypt.compareSync(password, data.password)) {
          const accessToken = await generateAccessToken(data)
          const refreshToken = await generateRefreshToken(data)
          ctx.body = JSON.stringify({
            success: true,
            msg: 'Seccess login',
            data: {
              accessToken: accessToken,
              refreshToken: refreshToken
            }
          })
          ctx.status = 200
          return
        }
      }
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Invalide credentials'
      })
      ctx.status = 401
    }
  } catch (err) {
    console.error('Error in Sign In', err)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'User with this email does not exist'
    })
    ctx.status = 404
  }
}

export async function signup (ctx: any): Promise<any> {
  try {
    const saltRounds = 12
    const { email, password } = ctx.request.body
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser: User = {
      email: email,
      password: hashedPassword,
      role: 'none', // or 'admin' depending on your logic
      confirmed: false,
      schedule_id: null, // fill in with appropriate value
      shifts: [], // or any default shifts
      created_at: new Date(),
      updated_at: new Date()
    }

    const createdUserResponse = await new AuthService().createUser(newUser)

    if (createdUserResponse.success) {
    }
    // await res.send({
    //   accessToken: generateToken(createdUser),
    //   refreshToken: generateRefreshToken(createdUser)
    // })
    const varificationLink = `${
      process.env.BASE_URL
    }/auth/varify-email/${generateAccessToken(createdUserResponse.data)}`
    await sendConfirmEmail(email, 'Verify email', varificationLink)

    ctx.body = JSON.stringify({
      success: true,
      msg: 'Verify your email'
    })
    ctx.status = 200
  } catch (err) {
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error: ' + err.message
    })
    ctx.status = 500
  }
}

export async function confirmEmail (ctx: any): Promise<any> {
  console.log("in confirm")
  const { token } = ctx.request.params // Assuming token is passed as a URL parameter
  console.log(token)
  try {
    // Decode and verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded._id) {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Invalid token'
      })
      ctx.status = 400
    }

    // Find the user by userId from the token payload
    const user = await new AuthService().getUserById(decoded._id)
    if (!user.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'User not found!'
      })
      ctx.status = 404
    } else {
      user.data.confirmed = true
    }

    try {
      await new AuthService().updateUser(decoded._id, user.data)
      ctx.status = 200
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Email verification successful '
      })
    } catch (err) {
      ctx.status = 500
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Internal server error: ' + err.message
      })
    }

    // Optionally, you can respond with a success message or redirect to a success page
  } catch (err) {
    console.error('Error in Email Verification', err)
    ctx.status = 500
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error: ' + err.message
    })
  }
}
