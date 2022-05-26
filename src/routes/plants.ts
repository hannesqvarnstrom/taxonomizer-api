import { Router, Request, Response, NextFunction } from 'express'
import { authMW, getUserIfExists } from '../middlewares/auth'
import { BadRequest, NotFound } from '../middlewares/errors'
import { Plant, User } from '../models'
export const plantsRouter = Router()

plantsRouter.get('/', getUserIfExists, async (req, res, next) => {
  const q = Plant.query()
    .where('is_private', false)
  
  if (req.user_id) {
    q.orWhere('user_id', req.user_id)
  }

  const plants = await q
  return res.send({plants})
})

plantsRouter.get('/:plantid', getUserIfExists, async (req, res, next) => {
  const q = Plant
    .query()
    .findById(req.params.plantid)
    .where('is_private', false)
    .first()

  if (req.user_id) {
    q.orWhere('user_id', req.user_id)
  }
  const plant = await q

  if (!plant) {
    return next(new NotFound())
  }

  return res.send({plant})
})

plantsRouter.post('/', authMW, async (req, res, next) => {
  const { name, image, is_private } = req.body
  const user_id = req.user_id
  
  if (!user_id) throw new BadRequest()

  const plantArgs = {
    name,
    image,
    is_private: !!is_private,
    user_id
  }
  try {
    const newPlant = await Plant.query().insert(plantArgs)
    return res.send({newPlant})
  } catch (error) {
    return next(new BadRequest())
  }
})