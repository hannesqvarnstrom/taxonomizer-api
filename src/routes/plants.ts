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

    console.warn('skipping integration of image linking / uploading')

    return res.status(201).send({newPlant})
  } catch (error) {
    console.log('error:', error)
    return next(new BadRequest())
  }
})

plantsRouter.put('/:plantId', authMW, async (req, res, next) => {
  const plant = await Plant
    .query()
    .findById(req.params.plantId)
    .first()
  
  if (!plant || !sameish(plant.user_id, req.user_id)) return next(new NotFound())

  const { name, image, is_private } = req.body
  const plantArgs = {
    name,
    image,
    is_private: !!is_private
  }

  const updatedPlant = await plant.$query().patch(plantArgs).returning('*')

  return res.send({updatedPlant})
})

plantsRouter.delete('/:plantId', authMW, async (req, res, next) => {
  const plant = await Plant
    .query()
    .findById(req.params.plantId)
    .first()

  if (!plant || !sameish(plant.user_id, req.user_id)) return next(new NotFound()) 
  await Plant.query().deleteById(plant.id)
  

  return res.status(203).send()
})

const sameish = (x: String | Number, y: String | Number): Boolean => String(x) === String(y)