import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './routes/auth'
import roomRouter from './routes/room'

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json()) // pars request to JSON
app.use(express.urlencoded({ extended: true })) // pars encoded request to JSON

//app.use("/user", userRouter);
app.use('/auth', authRouter)
app.use('/room', roomRouter)

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.get('*', (req, res) => {
  res.send('error 404: page not found!')
})

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.log('Failed to connect to MongoDB ' + error.message)
  })
