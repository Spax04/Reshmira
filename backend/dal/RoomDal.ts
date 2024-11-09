//import { clean, createToken } from '../../common';
const moment = require("moment-timezone");
import mongoose from "mongoose";
import { Room, RoomModel, RoomWithId } from "../db/models/room";
import { UserModel } from "../db/models/user";
interface UpdateRoomResponse {
  success: boolean;
  data?: RoomWithId | null;
  msg: string;
}
export class RoomDal {
  createRoom = async (roomData: Room) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string, {
        autoIndex: true,
      });

      if (!RoomModel.collection) {
        await RoomModel.createCollection();
      }

      const data: RoomWithId = await RoomModel.create(roomData);

      return {
        success: true,
        data,
        msg: `Room with id ${data._id}  has been created`,
      };
    } catch (error) {
      return { success: false, msg: "User creation error: " + error };
    } finally {
      await mongoose.disconnect();
    }
  };

  getRoomById = async (id: mongoose.Types.ObjectId) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string);

      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB is not connected");
      }

      const room = await RoomModel.findById(id).exec();

      if (!room) {
        throw "Room not exist";
      }

      const users = await UserModel.find({
        _id: { $in: room.users }, 
      }).select("_id full_name"); 

      const usersWithDetails = users.map((user) => ({
        _id: user._id,
        fullName: user.full_name,
      }));

      const roomWithUsers = {
        ...room.toObject(), 
        users: usersWithDetails,
      };

      return {
        success: true,
        data: roomWithUsers,
        msg: "Room retrieved successfully",
      };
    } catch (error) {
      console.error("Error in getRoomById:", error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  };

  getRoomBySecret = async (secret: String) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string);

      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB is not connected");
      }
      const trimmedSecret = secret.trim();
      console.log(secret);

      const data: RoomWithId = await RoomModel.findOne({
        secret: trimmedSecret,
      })
      if (data === null) {
        return { success: false, data, msg: "Wrong secret!" };
      }
      return { success: true, data, msg: "Room retrived by secret." };
    } catch (error) {
      console.error("Error in getRoomBySecret", error);
      throw error; 
    } finally {
      await mongoose.disconnect();
    }
  };

  updateRoom = async (
    id: mongoose.Types.ObjectId,
    updatedRoomData: Partial<RoomWithId>
  ): Promise<UpdateRoomResponse> => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string);

      const updatedRoom = await RoomModel.findByIdAndUpdate(
        id,
        updatedRoomData,
        {
          new: true,
        }
      );

      if (!updatedRoom) {
        return { success: false, msg: "User not found" };
      }

      return {
        success: true,
        data: updatedRoom,
        msg: `Room, with id ${updatedRoom._id}, has been updated`,
      };
    } catch (err) {
      return { success: false, msg: "Error: " + (err as Error).message };
    } finally {
      await mongoose.disconnect();
    }
  };

  getUsersByRoomId = async (id: mongoose.Types.ObjectId) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string);

      const room = await RoomModel.findById(id).exec();

      if (!room) {
        return {
          success: false,
          msg: "Room does not exist",
          data: null, //! If data is null, probably room has been deleted
        };
      }

      const users = await UserModel.find({
        _id: { $in: room.users }, 
      }).select("_id full_name"); 

      const userArray = users.map((user) => ({
        _id: user._id,
        fullName: user.full_name,
      }));

      return {
        success: true,
        data: userArray, 
        msg: "Users retrieved successfully",
      };
    } catch (error) {
      console.error("Error in getUsersByRoomId:", error);

      return {
        success: false,
        msg: "An error occurred while retrieving users: " + error.message,
        data: undefined,
      };
    }
  };

  deleteRoom = async (id: mongoose.Types.ObjectId) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string);

      await RoomModel.findByIdAndDelete(id).exec();

      return { success: true, msg: "Room was deleted sucessfuly" };
    } catch (err) {
      return { success: false, msg: "Error on deliting room!" };
    } finally {
      mongoose.disconnect();
    }
  };

  getRoomByScheduleId = async (scheduleId: mongoose.Types.ObjectId) => {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string);

      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB is not connected");
      }

      const data: RoomWithId = await RoomModel.findOne({
        schedule_id: scheduleId,
      })
      if (data === null) {
        return { success: false, msg: "No room with provided schedule" };
      }
      return { success: true, data, msg: "Room retrived by schedule Id!" };
    } catch (error) {
      console.error("Error in getRoomBySecret", error);
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  };


}
