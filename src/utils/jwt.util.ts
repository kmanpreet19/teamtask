import jwt from 'jsonwebtoken'
import config from '../config'

export function signJwt(payload: object, expiresIn = config.accessTokenExp) {
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn })
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, config.jwtAccessSecret)
  } catch (err) {
    return null
  }
}
