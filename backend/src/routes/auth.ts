import express, { Request, Response } from 'express'
import { isCorrectPassword, login, signUp,confirmEmail } from '../controllers/auth'

const authRouter = express.Router();


authRouter.post('/login', (req: Request, res: Response) => {
  return login(req, res)
})

authRouter.post('/signUp', (req: Request, res: Response) => {
  return signUp(req, res)
})

authRouter.get('/verify/:token', (req: Request, res: Response) => {
  return confirmEmail(req, res);
});

authRouter.post('/passCheck', (req: Request, res: Response) => {
  return isCorrectPassword(req, res)
})

export default authRouter
