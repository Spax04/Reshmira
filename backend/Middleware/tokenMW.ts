import * as jwt from "jsonwebtoken";
import { UserDal } from "../dal/UserDal";
import mongoose from "mongoose";
import { generateAccessToken } from "../utils/intex";

// Middleware to check token presence
export const tokenPresenceCheck = async (ctx: any, next: any) => {
  const token = ctx.headers["authorization"];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Token not provided" };
    return;
  }
  await next();
};

// Middleware to verify token structure and signature
export const tokenValidatiionCheck = async (ctx: any, next: any) => {
  const authorizationHeader = ctx.headers["authorization"];

  if (!authorizationHeader) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header not provided" };
    return;
  }

  console.log(authorizationHeader);
  const token = authorizationHeader.split(" ")[1];
  console.log(`Extracted token: ${token}`);

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Token not provided or malformed" };
    return;
  }

  try {
    console.log("token: " + token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token: ${JSON.stringify(decoded)}`);
    await next();
  } catch (err) {
    console.error(`Token verification error: ${err.message}`);
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
};

// Middleware to check token expiration
export const tokenExpirationCheck = async (ctx: any, next: any) => {
  const token = ctx.headers["authorization"]?.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Token not provided or malformed" };
    return;
  }

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    // Check if the access token has expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      // Retrieve the user ID from the token
      const userId = decoded._id;
      console.log(decoded._id);
      console.log(decoded);
      console.log(decoded.exp);

      if (!userId) {
        ctx.status = 401;
        ctx.body = { error: "Invalid token structure" };
        return;
      }

      // Fetch the user from the database (include the refresh token in user info)
      const { success: userByIdSuccess, data: userByIdData } =
        await new UserDal().getUserById(userId);

      if (!userByIdSuccess) {
        ctx.status = 401;
        ctx.body = { error: "Refresh token not found" };
        return;
      }

      // Verify the refresh token (assuming refresh tokens are JWTs)
      const refreshTokenDecoded = jwt.decode(
        userByIdData.refresh_token
      ) as jwt.JwtPayload;

      // Check if the refresh token is expired
      if (
        refreshTokenDecoded.exp &&
        refreshTokenDecoded.exp < Date.now() / 1000
      ) {
        ctx.status = 401;
        ctx.body = { error: "Refresh token expired" };
        return;
      }

      // Generate a new access token
      const newAccessToken = generateAccessToken(userByIdData);

      // Attach the new access token to the response header
      ctx.set("Authorization", `Bearer ${newAccessToken}`);

      // Proceed to the next middleware
      await next();
    } else {
      // If the access token is not expired, continue to the next middleware
      await next();
    }
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
};
