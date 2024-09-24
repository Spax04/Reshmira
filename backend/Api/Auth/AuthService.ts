//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { User, UserModel, UserWithId } from '../../db/models/user'
import * as nodemailer from 'nodemailer'
import { UserDal } from '../../dal/UserDal'
import * as bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../../utils/intex'
import * as jwt from 'jsonwebtoken'
export class AuthService {
  sendConfirmEmail = async (email: string, subject: string, text: string) => {
    try {
      let transsporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.EMAIL_SECURE),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })
      await transsporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text
      })
      return { success: true, msg: `Email sent successfully!` }
    } catch (err) {
      return { success: false, msg: `Email sent error: ` + err }
    }
  }

  authenticate = async (password: string, user: UserWithId) => {
    if (bcrypt.compareSync(password, user.password)) {
      const accessToken = await generateAccessToken(user)
      const refreshToken = await generateRefreshToken(user)

      user.refresh_token = refreshToken

      const response = await new UserDal().updateUser(user._id, user)

      if (!response.success) {
        return { success: false, msg: response.msg }
      }

      return {
        success: true,
        msg: 'Access token has been created',
        data: accessToken
      }
    }
  }

  registrateNewUser = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
    const hashedPassword = await bcrypt.hash(password, salt)

    const createdUserResponse = await new UserDal().createUser({
      email: email,
      full_name: fullName,
      password: hashedPassword,
      role: 'none', // or 'admin' depending on your logic
      confirmed: false,
      room_id: null, // fill in with appropriate value
      shifts: [], // or any default shifts
      refresh_token: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return createdUserResponse // { success, data, msg }
  }

  confirmValidationEmail = async (token: string) => {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded._id) {
      return { success: false, msg: 'Providet token not valided', code: 401 }
    }

    // Find the user by userId from the token payload
    const userResponse = await new UserDal().getUserById(decoded._id)
    if (!userResponse.success) {
      return { success: false, msg: 'User Not Found', code: 404 }
    } else {
      userResponse.data.confirmed = true
    }

    try {
      await new UserDal().updateUser(decoded._id, userResponse.data)
      return { success: true, msg: 'Email verification successful' }
    } catch (err) {
      return {
        success: true,
        msg: 'Internal server error: ' + err.message,
        code: 500
      }
    }
  }
}
