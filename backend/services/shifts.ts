import mongoose from 'mongoose'
import { Shift, ShiftWithId, shiftModel } from '../db/models/shift'

const createShift = (shiftData: Shift) => {
  return new Promise<ShiftWithId>((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL as string).then(() => {
      if (!shiftModel.collection) {
        shiftModel.createCollection()
      }
      const createdShift = shiftModel.create(shiftData).catch(error => {
        reject(error)
      })
      resolve(createdShift as unknown as ShiftWithId)
    })
  })
}

const getShift = (id: mongoose.Types.ObjectId) => {
  return new Promise<ShiftWithId>((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL as string).then(async () => {
      if (!shiftModel.collection) {
        shiftModel.createCollection()
        reject('Collection not found')
      }
      const foundShift = await shiftModel
        .findById(id)
        .exec()
        .catch(error => {
          reject(error)
        })
      resolve(foundShift as ShiftWithId)
    })
  })
}

const updateShift = (
  id: mongoose.Types.ObjectId,
  updatedShiftData: Partial<Shift>
) => {
  return new Promise<ShiftWithId>((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_URL as string)
      .then(async () => {
        try {
          const updatedShift = await shiftModel.findByIdAndUpdate(
            id,
            updatedShiftData,
            { new: true }
          )
          if (!updatedShift) {
            reject('Shift not found')
          }
          resolve(updatedShift as ShiftWithId)
        } catch (err) {
          reject(err)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

const deleteShift = (id: mongoose.Types.ObjectId) => {
  return new Promise<void>(async (resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL as string).then(async () => {
      await shiftModel
        .findByIdAndDelete(id)
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

export { createShift, getShift, updateShift, deleteShift }
