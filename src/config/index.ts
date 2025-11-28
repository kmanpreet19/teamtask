import dotenv from 'dotenv'
dotenv.config()

export default {
  port: process.env.PORT || 4000,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'change_this_access_secret',
  accessTokenExp: process.env.ACCESS_TOKEN_EXP || '15m',
  nodeEnv: process.env.NODE_ENV || 'development'
}
