import * as bodyParser from 'koa-bodyparser'
import { RoomService } from './RoomService'
import mongoose from 'mongoose'

export const RoomController = (router: any) => {
  router.post('/room/create', bodyParser(), createRoom)
  router.post('/room/join', bodyParser(), joinRoom)
  router.post('/room/out', bodyParser(), outRoom)
}

export async function createRoom (ctx: any): Promise<any> {
  try {
    const { adminId } = ctx.request.body

    const createdRoomResponse = await new RoomService().createRoom(adminId)

    if (createdRoomResponse.success) {
      ctx.body = JSON.stringify({
        success: true,
        data: createdRoomResponse.data
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Unseccfull to create a new room'
      })
      ctx.status = 500
    }
  } catch (err) {
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Running into error on room creating: ' + err
    })
    ctx.status = 500
  }
}

export async function joinRoom (ctx: any): Promise<any> {
  const { secret, newParticipantId } = ctx.request.body

  const room = await new RoomService().getRoomBySecret(secret)

  if (room.success) {
    room.data.users.push(new mongoose.Types.ObjectId(newParticipantId))

    const updateresponse = await new RoomService().updateRoom(
      room.data._id,
      room.data
    )

    ctx.body = JSON.stringify({
      success: true,
      data: room.data
    })
    ctx.status = 200
  } else {
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Not correct room code,try again'
    })
    ctx.status = 404
  }
}

export async function outRoom (ctx: any): Promise<any> {
  const { roomId, participantId } = ctx.request.body

  try {
    const roomService = new RoomService()

    const roomResponse = await roomService.getRoomById(
      new mongoose.Types.ObjectId(roomId)
    )

    if (!roomResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Room not found or incorrect ID'
      })
      ctx.status = 404
      return
    }

    const room = roomResponse.data
    const updatedUsers = room.users.filter(
      userId => userId.toString() !== participantId
    )

    const updatedRoomData = { ...room, users: updatedUsers }
    const updateresponse = await roomService.updateRoom(
      room._id,
      updatedRoomData
    )

    if (!updateresponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Failed to update room'
      })
      ctx.status = 500
      return
    }

    ctx.body = JSON.stringify({
      success: true,
      data: updatedRoomData
    })
    ctx.status = 200
  } catch (error) {
    console.error('Error in outRoom:', error)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error'
    })
    ctx.status = 500
  }
}
