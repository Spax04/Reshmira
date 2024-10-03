//import { clean, createToken } from '../../common';
const moment = require("moment-timezone");
import mongoose from "mongoose";
import { Room, RoomModel, RoomWithId } from "../../db/models/room";
import { generateRoomCode } from "../../utils/intex";
import { RoomDal } from "../../dal/RoomDal";
import { UserDal } from "../../dal/UserDal";

export class RoomService {
  createNewRoom = async (adminId: string) => {
    try {
      let secret = await generateRoomCode();

      let response = await new RoomDal().getRoomBySecret(secret);

      while (response.success) {
        secret = await generateRoomCode();
        response = await new RoomDal().getRoomBySecret(secret);
      }

      const newRoom: Room = {
        secret: secret,
        users: [new mongoose.Types.ObjectId(adminId)],
        adminId: new mongoose.Types.ObjectId(adminId),
        created_at: new Date(),
        updated_at: new Date(),
        schedule_id: null,
      };
      const {
        success: createRoomSuccess,
        data: createRoomData,
        msg: createRoomMsg,
      } = await new RoomDal().createRoom(newRoom);

      if (!createRoomSuccess) {
        return {
          success: createRoomSuccess,
          data: createRoomData,
          msg: createRoomMsg,
        };
      }

      const {
        success: getUserByIdSuccess,
        data: getUserByIdData,
        msg: getUserByIdMsg,
      } = await new UserDal().getUserById(new mongoose.Types.ObjectId(adminId));

      if (!getUserByIdSuccess) {
        return {
          success: getUserByIdSuccess,
          data: getUserByIdData,
          msg: getUserByIdMsg,
        };
      }

      getUserByIdData.room_id = createRoomData._id;

      const { success: updateUserSuccess, msg: updateUserMsg } =
        await new UserDal().updateUser(
          new mongoose.Types.ObjectId(adminId),
          getUserByIdData
        );

      if (!updateUserSuccess) {
        throw new Error(updateUserMsg);
      }

      console.log("NEW CREATED ROOM" + createRoomData);

      return {
        success: true,
        data: createRoomData,
        msg: "Room has been created successfully!",
      };
    } catch (err) {
      console.log(err);

      throw err;
    }
  };

  addRoomPatrticipant = async (
    secret: string,
    newParticipantId: string
  ): Promise<any> => {
    try {
      const {
        success: roomBySecretSuccess,
        data: roomBySecretData,
        msg: roomBySecretMsg,
      } = await new RoomDal().getRoomBySecret(secret);

      console.log(roomBySecretData);
      
      if (!roomBySecretSuccess) {
        return {
          success: roomBySecretSuccess,
          data: roomBySecretData,
          msg: roomBySecretMsg,
        };
      }
      roomBySecretData.users.push(
        new mongoose.Types.ObjectId(
          new mongoose.Types.ObjectId(newParticipantId)
        )
      );

      const {
        success: updateRoomSuccess,
        data: updateRoomData,
        msg: updateRoomMsg,
      } = await new RoomDal().updateRoom(
        roomBySecretData._id,
        roomBySecretData
      );

      if (!updateRoomSuccess) {
        return {
          success: updateRoomSuccess,
          msg: updateRoomMsg,
        };
      }

      const {
        success: userByIdSuccess,
        data: userByIdData,
        msg: userByIdMsg,
      } = await new UserDal().getUserById(
        new mongoose.Types.ObjectId(newParticipantId)
      );

      if (!userByIdSuccess) {
        return {
          success: userByIdSuccess,
          msg: userByIdMsg,
        };
      }

      userByIdData.room_id = roomBySecretData._id;
      const { success: updateUserSuccess, msg: updateUserMsg } =
        await new UserDal().updateUser(
          new mongoose.Types.ObjectId(newParticipantId),
          userByIdData
        );

      if (!updateUserSuccess) {
        return {
          success: updateUserSuccess,
          msg: updateUserMsg,
        };
      }

      return {
        success: updateRoomSuccess,
        data: updateRoomData,
        msg: updateRoomMsg,
      };
    } catch (err) {
      console.error("Error in updateRoom:", err);
      return {
        success: false,
        msg: "Running in problem on room update: " + err,
      };
    }
  };

  removeRoomPatrticipant = async (
    secret: string,
    participantIdToRemove: string
  ): Promise<any> => {
    try {
      const {
        success: roomBySecretSuccess,
        data: roomBySecretData,
        msg: roomBySecretMsg,
      } = await new RoomDal().getRoomBySecret(secret);

      if (!roomBySecretSuccess) {
        return {
          success: roomBySecretSuccess,
          data: roomBySecretData,
          msg: roomBySecretMsg,
        };
      }
      roomBySecretData.users = roomBySecretData.users.filter(
        (user: mongoose.Types.ObjectId) =>
          !user.equals(new mongoose.Types.ObjectId(participantIdToRemove))
      );

      const {
        success: updateRoomSuccess,
        data: updateRoomData,
        msg: updateRoomMsg,
      } = await new RoomDal().updateRoom(
        roomBySecretData._id,
        roomBySecretData
      );

      if (!updateRoomSuccess) {
        return {
          success: updateRoomSuccess,
          msg: updateRoomMsg,
        };
      }

      const {
        success: userByIdSuccess,
        data: userByIdData,
        msg: userByIdMsg,
      } = await new UserDal().getUserById(
        new mongoose.Types.ObjectId(participantIdToRemove)
      );

      if (!userByIdSuccess) {
        return {
          success: userByIdSuccess,
          msg: userByIdMsg,
        };
      }

      userByIdData.room_id = null;
      const { success: updateUserSuccess, msg: updateUserMsg } =
        await new UserDal().updateUser(
          new mongoose.Types.ObjectId(participantIdToRemove),
          userByIdData
        );

      if (!updateUserSuccess) {
        return {
          success: updateUserSuccess,
          msg: updateUserMsg,
        };
      }

      return {
        success: updateRoomSuccess,
        data: updateRoomData,
        msg: updateRoomMsg,
      };
    } catch (err) {
      console.error("Error in updateRoom:", err);
      return {
        success: false,
        msg: "Running in problem on room update: " + err,
      };
    }
  };

  deleteRoom = async (roomId: string): Promise<any> => {
    try {
      const roomObjectId = new mongoose.Types.ObjectId(roomId);

      // Step 1: Find all users who are associated with the room
      const { success: updateUsersSuccess, msg: updateUsersMsg } =
        await new UserDal().removeRoomFromUsers(roomObjectId);

      if (!updateUsersSuccess) {
        return {
          success: false,
          msg: updateUsersMsg,
        };
      }

      const { success: deleteRoomSuccess, msg: deleteRoomMsg } =
        await new RoomDal().deleteRoom(roomObjectId);

      if (!deleteRoomSuccess) {
        return {
          success: false,
          msg: deleteRoomMsg,
        };
      }

      return {
        success: true,
        msg: `Room with ID ${roomId} has been successfully deleted`,
      };
    } catch (err) {
      console.error("Error in deleteRoom:", err);
      return {
        success: false,
        msg: "Running in problem on room deleting: " + err,
      };
    }
  };
}
