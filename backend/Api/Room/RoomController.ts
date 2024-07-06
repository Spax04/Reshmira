import * as bodyParser from 'koa-bodyparser'
import { RoomService } from './RoomService'
import {
  generateAccessToken,
  generateRefreshToken,
  sendConfirmEmail
} from '../../utils/intex'
import { User } from '../../db/models/user'

export const RoomController = (router: any) => {
  router.post('/room/create', bodyParser(), createRoom)
  router.post('/room/join/:room-id', bodyParser(), joinRoom)
  router.post('/room/out', bodyParser(), outRoom)
}

export async function createRoom (ctx: any): Promise<any> {
  try {
    const { email, password } = ctx.request.body
  } catch (err) {}
}

export async function joinRoom (ctx: any): Promise<any> {}

export async function outRoom (ctx: any): Promise<any> {}
