import * as bodyParser from 'koa-bodyparser'
import { RoomService } from './RoomService'
import mongoose from 'mongoose'
import { RoomDal } from '../../dal/RoomDal'

export const RoomController = (router: any) => {
  router.post('/room/create', bodyParser(), createRoom)
  router.post('/room/join', bodyParser(), joinRoom)
  router.post('/room/out', bodyParser(), leaveRoom)
  router.post('/room/delete', bodyParser(), deleteRoom)
  router.post('/room/:roomId/users', bodyParser(), usersByRoomId)
  router.get('/room/:roomId', bodyParser(), getRoomById)
}

export async function getRoomById(ctx: any): Promise<any> {
  
  console.log("here");
  
  try {
    const { roomId } = ctx.request.params

    const { success, data, msg } = await new RoomDal().getRoomById(
      new mongoose.Types.ObjectId(roomId)
    )

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

export async function createRoom (ctx: any): Promise<any> {
  try {
    const { adminId } = ctx.request.body

    const { success, data, msg } = await new RoomService().createNewRoom(
      adminId
    )

    console.log(data);
    
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

  try {
    const {
      success: addRoomPatrticipantSuccess,
      data: addRoomPatrticipantData,
      msg: addRoomPatrticipantMsg
    } = await new RoomService().addRoomPatrticipant(secret, newParticipantId)

    if (addRoomPatrticipantSuccess) {
      ctx.body = JSON.stringify({
        success: addRoomPatrticipantSuccess,
        data: addRoomPatrticipantData,
        msg: 'Joing to room.'
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: addRoomPatrticipantMsg
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

export async function leaveRoom (ctx: any): Promise<any> {
  const { secret, participantId } = ctx.request.body

  try {
    const {
      success: removeRoomPatrticipantSuccess,
      data: removeRoomPatrticipantData,
      msg: removeRoomPatrticipantMsg
    } = await new RoomService().removeRoomPatrticipant(secret, participantId)

    if (removeRoomPatrticipantSuccess) {
      ctx.body = JSON.stringify({
        success: removeRoomPatrticipantSuccess,
        data: removeRoomPatrticipantData,
        msg: 'Leaving to room.'
      })
      ctx.status = 200
    } else {
      ctx.body = JSON.stringify({
        success: false,
        msg: removeRoomPatrticipantMsg
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

export async function deleteRoom (ctx: any): Promise<any> {
  const { roomId } = ctx.request.body

  try {
    const roomResponse = await new RoomDal().deleteRoom(
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
