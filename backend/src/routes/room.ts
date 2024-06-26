import express, { Request, Response } from 'express'
import { createRoom } from '../controllers/room'

const roomRouter = express.Router()

roomRouter.post('/create', (req: Request, res: Response) => {
  return createRoom(req, res)
})


export default roomRouter
