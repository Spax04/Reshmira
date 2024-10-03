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
      // Ensure Mongoose is connected
      await mongoose.connect(process.env.DATABASE_URL as string);

      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB is not connected");
      }

      // Find the room by ID
      const room = await RoomModel.findById(id).exec();

      if (!room) {
        throw "Room not exist";
      }

      // Fetch the users by their IDs in the room
      const users = await UserModel.find({
        _id: { $in: room.users }, // Match user IDs that are in the room's users array
      }).select("_id full_name"); // Select only _id and full_name

      // Map the users to return an array of objects with id and full_name
      const usersWithDetails = users.map((user) => ({
        _id: user._id,
        fullName: user.full_name,
      }));

      // Replace the room's users array (containing only IDs) with the full objects (id + full_name)
      const roomWithUsers = {
        ...room.toObject(), // Convert Mongoose document to plain JS object
        users: usersWithDetails, // Replace the users array with the populated user data
      };

      // Return the room with the populated users array
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
      // Ensure Mongoose is connected
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
      throw error; // Re-throw the error for handling in caller function
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
      // Connect to the database (will only connect if not already connected)
      await mongoose.connect(process.env.DATABASE_URL as string);

      // Find the room by ID
      const room = await RoomModel.findById(id).exec();

      if (!room) {
        return {
          success: false,
          msg: "Room does not exist",
          data: null, //! If data is null, probably room has been deleted
        };
      }

      // Find the users by their IDs in the room
      const users = await UserModel.find({
        _id: { $in: room.users }, // Fetch users whose IDs are in the room's users array
      }).select("_id full_name"); // Select only the _id and full_name fields

      // Map the result to return an array of objects with id and full_name
      const userArray = users.map((user) => ({
        _id: user._id,
        fullName: user.full_name,
      }));

      return {
        success: true,
        data: userArray, // Return the array of objects containing id and full_name
        msg: "Users retrieved successfully",
      };
    } catch (error) {
      // Catch and log any error (connection error or other)
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
}
