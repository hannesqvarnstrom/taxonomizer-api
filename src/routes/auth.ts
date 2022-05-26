import { Router } from 'express'
import * as logger from 'heroku-logger'
import { User } from '../models'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { BadRequest, NoRecordsOfUser, PasswordMismatch, EmailTaken } from '../middlewares/errors'

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
      const buff = Buffer.from(key)

      const expiresIn = 120 // test this
      const token = await jwt.sign(payload, key, {
        expiresIn,
        subject: String(user.id)
      })

      return res.send({ token, expiresIn })
    } else {
      throw new NoRecordsOfUser()
    }
  } catch (e) {
    next(e)
  }
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

