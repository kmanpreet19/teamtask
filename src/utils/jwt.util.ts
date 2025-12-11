import jwt from 'jsonwebtoken'
import config from '../config'

export function signJwt(payload: object, expiresIn = config.accessTokenExp) {
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn })
}

export function verifyJwt(token: string) {
  try {
    console.log("VERIFYING with secret:", process.env.JWT_ACCESS_SECRET);
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
  } catch (err: any) {
    console.log("JWT ERROR:", err.message);
    return null;
  }
}

