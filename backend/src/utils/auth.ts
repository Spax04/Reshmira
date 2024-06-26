import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserWithId } from '../models/user'
import nodemailer from 'nodemailer'

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization: string | undefined = req.headers.authorization
  if (authorization) {
    const token: string = authorization.slice(7, authorization.length) // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: Error, decode: string | JwtPayload) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' })
        } else {
          const currentTime = Date.now() / 1000
          if (decode.exp && currentTime > decode.exp) {
            res.status(401).send({ message: 'Access Token Expired' })
          } else {
            // @ts-ignore
            req.user = decode
            next()
          }
        }
      }
    )
  } else {
    res.status(401).send({ message: 'No Token' })
  }
}

export const generateToken = (user: UserWithId): string => {
  return jwt.sign(
    { _id: user._id }, // add _id: user._id
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

export const sendConfirmEmail = async (email, subject, text) => {
  try {

    console.log(process.env.EMAIL_HOST);
    console.log(process.env.EMAIL_PORT)
    console.log(process.env.EMAIL_SECURE);
    console.log(process.env.EMAIL_USER)
    console.log( process.env.EMAIL_PASS);
    console.log(email)
    console.log(subject);
    console.log(text)
    
    let transsporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.EMAIL_SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      
    })
    await transsporter.sendMail({
      from:process.env.EMAIL_USER,
      to:email,
      subject: subject,
      text:text
    })
    console.log("Email sent successfully!")
  } catch (error) {
    console.log("Email sent : " + error)
  }
}
