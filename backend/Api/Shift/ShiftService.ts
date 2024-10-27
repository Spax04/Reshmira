//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { Shift, ShiftWithId, ShiftModel } from '../../db/models/shift'

export class ShiftService {
  createShift = async (newShift: Shift) => {
    try {

      
      await mongoose.connect(process.env.DATABASE_URL as string)

      if (!ShiftModel.collection) {
        await ShiftModel.createCollection()
      }

      const data = await ShiftModel.create(newShift)
      await mongoose.disconnect()

      return { success: true, data, msg: 'Schedule has been created' }
    } catch (error) {
      throw error
    }
  }


}
