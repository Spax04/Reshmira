//import { clean, createToken } from '../../common';
const moment = require("moment-timezone");
import mongoose from "mongoose";
import { User, UserModel, UserWithId } from "../../db/models/user";
import * as nodemailer from "nodemailer";
import { UserDal } from "../../dal/UserDal";
import * as bcrypt from "bcryptjs";
import { generateAccessToken, generateRandom4DigitNumber, generateRefreshToken, generateResetToken, sendEmail } from "../../utils/intex";
import * as jwt from "jsonwebtoken";
export class AuthService {
  sendConfirmEmail = async (user: UserWithId) => {
    try {
      // Generate the verification link
      const verificationLink = `${process.env.BASE_URL}/auth/verify-email/${generateAccessToken(user)}`;

      // Email subject
      const subject = "Email Verification";

      // Email text including a subtitle and the verification link
      const text = `Dear ${user.full_name},\n\n` +
        `Thank you for registering. Please verify your email address by clicking the link below:\n\n` +
        `Verification Link: ${verificationLink}\n\n` +
        `If you did not create this account, please ignore this email.\n\n` +
        `Best regards,\nReshmira team`;

      // Send the email
      await sendEmail(user.email, subject, text);

      return { success: true, msg: `Email sent successfully!` };
    } catch (err) {
      return { success: false, msg: `Email send error: ` + err.message };
    }
  };


  authenticate = async (password: string, user: UserWithId) => {
    if (bcrypt.compareSync(password, user.password)) {
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      console.log("new access token:   " + accessToken);

      user.refresh_token = refreshToken;

      const response = await new UserDal().updateUser(user._id, user);

      if (!response.success) {
        return { success: false, msg: response.msg };
      }

      return {
        success: true,
        msg: "Access token has been created",
        data: accessToken,
      };
    }
  };

  registrateNewUser = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUserResponse = await new UserDal().createUser({
      email: email,
      full_name: fullName,
      password: hashedPassword,
      role: "none", // or 'admin' depending on your logic
      confirmed: false,
      room_id: null, // fill in with appropriate value
      shifts: [], // or any default shifts
      refresh_token: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return createdUserResponse; // { success, data, msg }
  };

  resetUserPassword = async (
    token: string, newPassword: string
  ) => {

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return { success: false, msg: "Provided token not validated", code: 401 };
    }

    try {
      const { success: userResponseSuccess, data: userResponseData, msg: userResponseMsg } = await new UserDal().getUserById(decoded._id);

      if (!userResponseSuccess)
        return { success: false, msg: "User Not Found", code: 404 };

      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      userResponseData.password = hashedPassword

      await new UserDal().updateUser(decoded._id, userResponseData);

      return {
        success: true,
        msg: "Password was updated successfully!",
        code: 200,
      };

    } catch (err) {
      return {
        success: false,
        msg: "Internal server error: " + err.message,
        code: 500,
      };
    }

  };

  confirmValidationEmail = async (token: string) => {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return { success: false, msg: "Providet token not valided", code: 401 };
    }

    // Find the user by userId from the token payload
    const userResponse = await new UserDal().getUserById(decoded._id);
    if (!userResponse.success) {
      return { success: false, msg: "User Not Found", code: 404 };
    } else {
      userResponse.data.confirmed = true;
    }

    try {
      await new UserDal().updateUser(decoded._id, userResponse.data);
      return { success: true, msg: "Email verification successful" };
    } catch (err) {
      return {
        success: false,
        msg: "Internal server error: " + err.message,
        code: 500,
      };
    }
  };

  sendResetCode = async (token: string, email: string) => {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return { success: false, msg: "Providet token not valided", code: 401 };
    }

    try {

      const { success: userResponseSuccess, data: userResponseData, msg: userResponseMsg } = await new UserDal().getUserById(decoded._id);

      if (!userResponseSuccess) {

        return { success: false, msg: "User Not Found", code: 404 };

      } else {

        const secretCode = generateRandom4DigitNumber()
        userResponseData.reset_token = generateResetToken(userResponseData, secretCode);

        const emailText = `Dear user, \n\nWe have received a request to reset your password. Please use the following secret code to proceed with the reset:\n\nReset Code: ${secretCode}\n\nIf you did not request a password reset, please ignore this email.`;
        await sendEmail(email, "Reset Password Request", emailText)
      }

      await new UserDal().updateUser(decoded._id, userResponseData);

      return { success: true, msg: "Email with verification code has been sended!" };
    } catch (err) {
      return {
        success: true,
        msg: "Internal server error: " + err.message,
        code: 500,
      };
    }
  };

  verifyResetCode = async (token: string, code: string) => {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return { success: false, msg: "Provided token not validated", code: 401 };
    }

    try {
      const { success: userResponseSuccess, data: userResponseData, msg: userResponseMsg } = await new UserDal().getUserById(decoded._id);

      if (!userResponseSuccess) {
        return { success: false, msg: "User Not Found", code: 404 };
      } else {
        const resetToken = userResponseData.reset_token; // Retrieve reset token from user data
        if (!resetToken) {
          return { success: false, msg: "No reset token found", code: 404 };
        }

        try {
          // Decode the reset_token
          const decodedResetToken: any = jwt.verify(resetToken, process.env.JWT_SECRET);

          // Check if the secret code matches
          if (decodedResetToken.resetCode !== code) {
            return { success: false, msg: "Invalid reset code", code: 401 };
          }

          // If everything matches and token is valid, continue
          return { success: true, msg: "Reset code verified successfully" };
        } catch (error) {
          if (error.name === 'TokenExpiredError') {
            return { success: false, msg: "Reset token has expired", code: 401 };
          } else {
            return { success: false, msg: "Invalid reset token", code: 401 };
          }
        }
      }
    } catch (err) {
      return {
        success: true,
        msg: "Internal server error: " + err.message,
        code: 500,
      };
    }
  };

}
