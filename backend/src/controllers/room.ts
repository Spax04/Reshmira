import { Request, Response } from 'express'
import { UserModel, User, UserWithId } from '../models/user'
import bcrypt from 'bcryptjs'
import {
  generateRefreshToken,
  generateToken,
  sendConfirmEmail
} from '../utils/auth'
import jwt from 'jsonwebtoken'
import { createUser, getUser, updateUser } from '../services/users'

export async function createRoom (req: Request, res: Response): Promise<any> {
  try {
    const saltRounds = 12
    console.log(req.body)
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser: User = {
      email: email,
      password: hashedPassword,
      role: 'guest', // or 'admin' depending on your logic
      confirmed: false,
      schedule_id: '', // fill in with appropriate value
      shifts: [], // or any default shifts
      created_at: new Date(),
      updated_at: new Date()
    }

    const createdUser: UserWithId = await createUser(newUser)

    console.log(createdUser)
    // await res.send({
    //   accessToken: generateToken(createdUser),
    //   refreshToken: generateRefreshToken(createdUser)
    // })
    const varificationLink = `http://localhost:5000/auth/verify/${generateToken(
      createdUser
    )}`
    await sendConfirmEmail(email, 'Verify email', varificationLink)

    await res.send('Verify your email')
  } catch (err) {
    console.error('Error in Signup', err)
    res
      .status(500)
      .send({ message: 'Internal server error', error: err.message })
  }
}

