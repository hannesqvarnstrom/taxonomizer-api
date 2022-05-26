import { Router, Request, Response, NextFunction } from 'express'
import * as logger from 'heroku-logger'
import { User } from '../models'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { BadRequest, NoRecordsOfUser, PasswordMismatch, EmailTaken, SessionExpired } from '../middlewares/errors'
import { authMW, getUserIfExists } from '../middlewares/auth'

export const authRouter = Router()

const validateEmail = (email: string) => {
  const ok = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  if (!ok) {
    throw new BadRequest()
  }
}

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    validateEmail(email)
    const user = await User.query().where('email', email).first()
    if (!user) throw new NoRecordsOfUser()
    const pwCorrect = await bcrypt.compare(password, user.password)

    if (pwCorrect) {
      const payload = {
        id: user.id,
        email: user.email
      }

      const key = process.env.PRIVATE_KEY

      const expiresIn = 60 * 60
      const token = await jwt.sign(payload, key, {
        expiresIn
      })

      return res.send({ token, expiresIn })
    } else {
      throw new NoRecordsOfUser()
    }
  } catch (e) {
    next(e)
  }
})

authRouter.get('/am-i-logged-in', getUserIfExists, async (req, res, next) => {
  let answer
  if(req.user_id) answer = 'yes'
  else answer = 'no'
  return res.send({answer})
})

authRouter.get('/gate', authMW, async (req, res, next) => {
  return res.send()
})

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, passwordConfirmation, image } = req.body

    if (typeof password !== 'string' || typeof passwordConfirmation !== 'string') throw new BadRequest()
    validateEmail(email)
    if (password.trim() !== passwordConfirmation.trim()) throw new PasswordMismatch()

    const exists = await User.query().where('email', email.trim()).first()

    if (exists) throw new EmailTaken()

    const hashedPW = await bcrypt.hash(password, 10)

    await User.query().insert({ email, password: hashedPW, image })

    return res.status(201).send({ message: 'User created' })
  } catch (e) {
    next(e)
  }
})

