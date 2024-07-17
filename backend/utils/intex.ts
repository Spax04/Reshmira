import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserWithId } from '../db/models/user'
import * as nodemailer from 'nodemailer'

export const generateAccessToken = (user: UserWithId) => {
  return jwt.sign(
    { _id: user._id, }, // add _id: user._id
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  )
}

export const generateRefreshToken = (user: UserWithId): string => {
  return jwt.sign(
    { _id: user._id }, // add _id: user._id later (userWithId)
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  )
}

export const sendConfirmEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  try {
    console.log(process.env.EMAIL_HOST)
    console.log(process.env.EMAIL_PORT)
    console.log(process.env.EMAIL_SECURE)
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
    console.log(email)
    console.log(subject)
    console.log(text)

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
    console.log('Email sent successfully!')
  } catch (error) {
    console.log('Email sent : ' + error)
  }
}

export const generateRoomCode = async (): Promise<string> => {
  const fixedCodeLength = 6
  const lowerCaseAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const upperCaseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const numbers = '0123456789'.split('')

  let codeResult = []
  for (let i = 0; i < fixedCodeLength; i++) {
    const arraySelected = Math.floor(Math.random() * 3)

    switch (arraySelected) {
      case 0:
        const lowerCharSelected = Math.floor(
          Math.random() * lowerCaseAlphabet.length
        )
        codeResult[i] = lowerCaseAlphabet[lowerCharSelected]
        break
      case 1:
        const upperCharSelected = Math.floor(
          Math.random() * upperCaseAlphabet.length
        )
        codeResult[i] = upperCaseAlphabet[upperCharSelected]
        break
      case 2:
        const numberSelected = Math.floor(Math.random() * numbers.length)
        codeResult[i] = numbers[numberSelected]
        break
    }
  }

  return codeResult.join('')
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendConfirmEmail,
  generateRoomCode
}
