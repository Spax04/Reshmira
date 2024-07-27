//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { User, UserModel, UserWithId } from '../../db/models/user'
import * as nodemailer from 'nodemailer'
import { UserDal } from '../../dal/UserDal'
import * as bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../../utils/intex'
import * as jwt from 'jsonwebtoken'

interface JwtPayload {
  _id: string
  // Add any other fields that your JWT payload contains
}

export class UserService {
  retriveUserByToken = async (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    console.log(decoded)
    // Extract user ID from the decoded token
    const userId = decoded._id

    const response = await new UserDal().getUserById(
      new mongoose.Types.ObjectId(userId)
    )

    if (!response.success) {
      return { success: false, msg: response.msg }
    }

    return {
      success: true,
      msg: 'User has been retieved',
      data: {
        _id: response.data._id,
        fullName: response.data.full_name,
        email: response.data.email,
        role: response.data.role,
        scheduleId: response.data.schedule_id,
        shifts: [...response.data.shifts]
      }
    }
  }
}
