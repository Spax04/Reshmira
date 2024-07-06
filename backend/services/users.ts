import mongoose from 'mongoose'
import { User, UserModel, UserWithId } from '../db/models/user'

const createUser = async (userData: User) => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string)

    if (!UserModel.collection) {
      await UserModel.createCollection()
    }

    const createdUser = await UserModel.create(userData)
    await mongoose.disconnect()

    return createdUser as UserWithId
  } catch (error) {
    throw error
  }
}

const getUser = async (
  id: mongoose.Types.ObjectId
): Promise<UserWithId | null> => {
  try {
    // Ensure Mongoose is connected
    await mongoose.connect(process.env.DATABASE_URL as string)

    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB is not connected')
    }

    const user = await UserModel.findById(id).exec()
    return user
  } catch (error) {
    console.error('Error in getUser:', error)
    throw error // Re-throw the error for handling in caller function
  }
}

const updateUser = (
  id: mongoose.Types.ObjectId,
  updatedUserData: Partial<User>
) => {
  return new Promise<UserWithId>((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URL as string)
      .then(async () => {
        try {
          const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updatedUserData,
            { new: true }
          )
          if (!updatedUser) {
            reject('User not found')
          }
          resolve(updatedUser as UserWithId)
        } catch (err) {
          reject(err)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

const deleteUser = (id: mongoose.Types.ObjectId) => {
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

export { createUser, getUser, updateUser, deleteUser }
