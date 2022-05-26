import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { NotFound, Unauthorized } from './errors'

export const authMW = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization
    if (!auth) throw new Unauthorized()
    const token = auth.substr(auth.indexOf(' ') + 1, auth.length)


    const verified = await jwt.verify(token, process.env.PRIVATE_KEY) as jwt.JwtPayload
    req.user_id = verified.id
  } catch (error) {
    return next(error)
  }

  return next()
}

export const getUserIfExists = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  if (auth) {
    const token = auth.substr(auth.indexOf(' ') + 1, auth.length)

    try {
      const verified = await jwt.verify(token, process.env.PRIVATE_KEY) as jwt.JwtPayload
      req.user_id = verified.id
    } catch (error) {
      return next()
    }
  }
  
  return next()
}