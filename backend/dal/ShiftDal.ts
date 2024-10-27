//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { Shift, ShiftWithId, ShiftModel } from '../db/models/shift'

export class ShiftDal {
  createShift = async (newShift: Shift) => {
    try {

      
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (!ShiftModel.collection) {
        await ShiftModel.createCollection()
      }

      const data : ShiftWithId = await ShiftModel.create(newShift)
      await mongoose.disconnect()

      return { success: true, data, msg: 'Schedule has been created' }
    } catch (error) {
      throw error
    }
  }
   getShiftsList = async (list: mongoose.Types.ObjectId[]) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string);
  
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected');
      }
  
      // Retrieve documents where _id matches any id in the provided list
      const data = await ShiftModel.find({ _id: { $in: list } }).exec();
  
      if (data.length > 0) {
        return { success: true, data, msg: 'Shifts retrieved by id list' };
      } else {
        throw 'No shifts found for provided IDs';
      }
    } catch (error) {
      console.error('Error in getShiftsList:', error);
      throw error; // Re-throw the error for handling in caller function
    }
  };

  getShiftById = async (id: mongoose.Types.ObjectId) => {
    try {
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected')
      }

      const data = await ShiftModel.findById(id).exec()
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

  
  updateShift = (
    id: mongoose.Types.ObjectId,
    updatedUserData: Partial<Shift>
  ) => {
    return new Promise<ShiftWithId>((resolve, reject) => {
      mongoose
        .connect(process.env.DATABASE_URL as string)
        .then(async () => {
          try {
            const updatedUser = await ShiftModel.findByIdAndUpdate(
              id,
              updatedUserData,
              { new: true }
            )
            if (!updatedUser) {
              reject('User not found')
            }
            resolve(updatedUser as ShiftWithId)
          } catch (err) {
            reject(err)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  deleteShift = (id: mongoose.Types.ObjectId) => {
    return new Promise<void>(async (resolve, reject) => {
      mongoose.connect(process.env.DATABASE_URL as string).then(async () => {
        await ShiftModel.findByIdAndDelete(id)
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
