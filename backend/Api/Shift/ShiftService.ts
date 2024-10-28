//import { clean, createToken } from '../../common';
const moment = require('moment-timezone')
import mongoose from 'mongoose'
import { Shift, ShiftWithId, ShiftModel } from '../../db/models/shift'
import { UserDal } from '../../dal/UserDal'

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

  addGuardDataToShift = async (shifts: ShiftWithId[]) => {
    const tempGuards: { [key: string]: { fullName: string } } = {}; 
    const updatedShifts = []; // New array to hold the transformed shifts
  
    for (const shift of shifts) {
      const updatedGuardPosts = []; // New array for guard posts with full details
  
      for (const post of shift.guard_posts) {
        const guardDetails = []; // Array to hold detailed guard information
  
        for (const guardId of post.guards_id) {
          const guardKey = guardId.toString(); 
  
          // Check cache for guard info
          if (!tempGuards[guardKey]) {
            try {
              const userResponse = await new UserDal().getUserById(guardId);
  
              if (userResponse.success && userResponse.data) {
                tempGuards[guardKey] = { fullName: userResponse.data.full_name };
              } else {
                console.warn(`User with ID ${guardId} not found`);
              }
            } catch (error) {
              console.error(`Error fetching user with ID ${guardId}:`, error);
            }
          }
  
          // Add the guard details to the guardDetails array
          guardDetails.push({
            _id: guardId,
            fullName: tempGuards[guardKey]?.fullName || null // Set fullName from cache or null if not found
          });
        }
  
        // Construct the updated post with guard details
        updatedGuardPosts.push({
          position_name: post.position_name, // Retain other properties as needed
          guards: guardDetails // Use 'guards' instead of 'guards_id'
        });
      }
  
      // Construct the updated shift object
      updatedShifts.push({
        _id: shift._id,
        start_time: shift.start_time,
        end_time: shift.end_time,
        schedule_id: shift.schedule_id,
        guard_posts: updatedGuardPosts // Replace with new guard posts structure
      });
    }
  
    return updatedShifts; // Return the newly structured shifts
  };
  

}
