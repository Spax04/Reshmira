//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { User, UserModel, UserWithId } from '../db/models/user'
interface UpdateUserResponse {
  success: boolean
  data?: UserWithId | null
  msg: string
}
export class UserDal {
  createUser = async (userData: User) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (!UserModel.collection) {
        await UserModel.createCollection()
      }

      const data : UserWithId = await UserModel.create(userData)
      await mongoose.disconnect()

      return { success: true, data, msg: `User with id  has been created` }
    } catch (error) {
      return { success: false, msg: 'User creation error: ' + error }
    }
  }

  getUserById = async (id: mongoose.Types.ObjectId) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected')
      }

      const data = await UserModel.findById(id).exec()
      if (data != null) {
        return { success: true, data, msg: 'user retrived by id' }
      } else {
        throw 'User not exist'
      }
    } catch (error) {
      console.error('Error in getUser:', error)
      throw error // Re-throw the error for handling in caller function
    }
  }

  getUserByEmail = async (email: String) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected')
      }

      const data: UserWithId = await UserModel.findOne({ email: email }).exec()
      return { success: true, data, msg: 'user retrived by email' }
    } catch (error) {
      console.error('Error in getUser:', error)
      throw error // Re-throw the error for handling in caller function
    }
  }

  updateUser = async (
    id: mongoose.Types.ObjectId,
    updatedUserData: Partial<UserWithId>
  ): Promise<UpdateUserResponse> => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updatedUserData,
        {
          new: true
        }
      )

      if (!updatedUser) {
        return { success: false, msg: 'User not found' }
      }

      return {
        success: true,
        data: updatedUser,
        msg: `User, with id ${updatedUser._id}, has been updated`
      }
    } catch (err) {
      return { success: false, msg: 'Error: ' + (err as Error).message }
    } finally {
      await mongoose.disconnect()
    }
  }

  deleteUser = (id: mongoose.Types.ObjectId) => {
    return new Promise<void>(async (resolve, reject) => {
      mongoose.connect(process.env.DATABASE_URL as string).then(async () => {
        await UserModel.findByIdAndDelete(id)
          .exec()
          .catch(err => {
            if (err) {
              reject(err)
            }
          })
        resolve()
      })
    })
  }
}
