import * as bodyParser from 'koa-bodyparser'
import { RoomService } from './RoomService'
import mongoose from 'mongoose'

export const RoomController = (router: any) => {
  router.post('/room/create', bodyParser(), createRoom)
  router.post('/room/join', bodyParser(), joinRoom)
  router.post('/room/out', bodyParser(), outRoom)
  router.post('/room/delete', bodyParser(), deleteRoom)
  router.post('/room/:roomId/users', bodyParser(), usersByRoomId)
}

export async function createRoom (ctx: any): Promise<any> {
  try {
    const { adminId } = ctx.request.body

    const { success, data, msg } = await new RoomService().createRoom(adminId)

    if (success) {
      ctx.body = JSON.stringify({
        success: true,
        data: data,
        msg: msg
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: msg
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

  const {
    success: roomBySecretSuccess,
    data: roomBySecretData,
    msg: roomBySecretMsg
  } = await new RoomService().getRoomBySecret(secret)

  if (roomBySecretSuccess) {
    roomBySecretData.users.push(new mongoose.Types.ObjectId(newParticipantId))

    const {
      success: updateRoomSuccess,
      data: updateRoomData,
      msg: updateRoomMsg
    } = await new RoomService().updateRoom(
      roomBySecretData._id,
      roomBySecretData
    )

    if (updateRoomSuccess) {
      ctx.body = JSON.stringify({
        success: updateRoomSuccess,
        data: updateRoomData,
        msg: "Joing to room."
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: 'Error on adding new participant to the room.'
      })
      ctx.status = 500
    }
  } else {
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Not correct room code, try again.'
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

export async function deleteRoom (ctx: any): Promise<any> {
  const { roomId } = ctx.request.body

  try {
    const roomResponse = await new RoomService().deleteRoom(
      new mongoose.Types.ObjectId(roomId)
    )

    if (!roomResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: roomResponse.msg
      })
      ctx.status = 404
      return
    } else {
      ctx.body = JSON.stringify({
        success: true,
        msg: roomResponse.msg
      })
      ctx.status = 200
      return
    }
  } catch (error) {
    console.error('Error in outRoom:', error)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error'
    })
    ctx.status = 500
  }
}

export async function usersByRoomId (ctx: any): Promise<any> {
  const { roomId } = ctx.request.params

  try {
    const roomResponse = await new RoomService().getUsersByRoomId(
      new mongoose.Types.ObjectId(roomId)
    )

    if (!roomResponse.success) {
      ctx.body = JSON.stringify({
        success: false,
        msg: roomResponse.msg
      })
      ctx.status = 404
      return
    } else {
      ctx.body = JSON.stringify({
        success: true,
        data: roomResponse.data,
        msg: roomResponse.msg
      })
      ctx.status = 200
      return
    }
  } catch (error) {
    console.error('Error in outRoom:', error)
    ctx.body = JSON.stringify({
      success: false,
      msg: 'Internal server error'
    })
    ctx.status = 500
  }
}
