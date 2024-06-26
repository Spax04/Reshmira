import { Request, Response } from 'express'
import { UserModel, User, UserWithId } from '../models/user'
import bcrypt from 'bcryptjs'
import {
  generateRefreshToken,
  generateToken,
  sendConfirmEmail
} from '../utils/auth'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { createUser, getUser, updateUser } from '../services/users'

export async function signUp (req: Request, res: Response): Promise<any> {
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

export async function login (req: Request, res: Response): Promise<any> {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })
    if (user) {
      if (!user.confirmed) {
        res.status(401).send({ message: 'Email is not verified' })
      }
      if (bcrypt.compareSync(password, user.password)) {
        res.send({
          accessToken: generateToken(user),
          refreshToken: generateRefreshToken(user)
        })
        return
      }
    }
    res.status(401).send({ message: 'Invalid Credentials' })
  } catch (err) {
    console.error('Error in Sign In', err)
    res
      .status(500)
      .send({ message: 'Internal server error', error: err.message })
  }
}

export async function confirmEmail (req: Request, res: Response): Promise<any> {
  const { token } = req.params // Assuming token is passed as a URL parameter

  try {
    // Decode and verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded._id) {
      return res.status(400).send({ message: 'Invalid token' })
    }

    // Find the user by userId from the token payload
    const user = await getUser(decoded._id)
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }

    console.log(user)

    // Mark the user as confirmed (update the confirmed field to true)
    user.confirmed = true
    try {
      await updateUser(decoded._id, user)
      res.status(200).send({ message: 'Email verification successful' })
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Internal server error', error: err.message })
    }

    // Optionally, you can respond with a success message or redirect to a success page
  } catch (err) {
    console.error('Error in Email Verification', err)
    res
      .status(500)
      .send({ message: 'Internal server error', error: err.message })
  }
}

export async function isCorrectPassword (
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { userId, password } = req.body

    // TODO: add _id when generating token
    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }

    // comapre the provided password with hashed password
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).send(isMatch)
    }
    return res.send({ isCorrect: isMatch })
  } catch (error) {
    console.error('Error in checkPassword', error)
    return res
      .status(500)
      .send({ message: 'Internal server error', error: error.message })
  }
}
