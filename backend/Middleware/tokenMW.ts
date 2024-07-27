import * as jwt from 'jsonwebtoken'

// Middleware to check token presence
export const tokenPresenceCheck = async (ctx: any, next: any) => {
  const token = ctx.headers['authorization']
  if (!token) {
    ctx.status = 401
    ctx.body = { error: 'Token not provided' }
    return
  }
  await next()
}

// Middleware to verify token structure and signature
export const tokenValidatiionCheck = async (ctx: any, next: any) => {
  const authorizationHeader = ctx.headers['authorization'];

  if (!authorizationHeader) {
    ctx.status = 401;
    ctx.body = { error: 'Authorization header not provided' };
    return;
  }

  console.log(authorizationHeader)
  const token = authorizationHeader.split(' ')[1];
  console.log(`Extracted token: ${token}`);

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Token not provided or malformed' };
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token: ${JSON.stringify(decoded)}`);
    await next();
  } catch (err) {
    console.error(`Token verification error: ${err.message}`);
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
}

// Middleware to check token expiration
export const tokenExpirationCheck = async (ctx: any, next: any) => {
  const token = ctx.headers['authorization']?.split(' ')[1]
  if (!token) {
    ctx.status = 401
    ctx.body = { error: 'Token not provided or malformed' }
    return
  }

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      ctx.status = 401
      ctx.body = { error: 'Token expired' }
      return
    }
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { error: 'Invalid token' }
  }
}
