import { Router, Request, Response, NextFunction } from 'express'
import { authMW, getUserIfExists } from '../middlewares/auth'
import { BadRequest, NotFound, TError } from '../middlewares/errors'
import Services from '../services/index.service'
export const plantsRouter = Router()

plantsRouter.get('/', getUserIfExists, async (req, res, next) => {
  try {
    const plants = await Services.plantsService().getPublicPlants(req.user_id)
    console.log('plants:', plants)
    return res.send({ plants })

  } catch (e) {
    console.log('error:', e)
    next(e)
  }
})

plantsRouter.get('/:plantid', getUserIfExists, async (req, res, next) => {
  const plant = await Services.plantsService().publicFindById(req.params.plantid, req.user_id)

  if (!plant) {
    return next(new NotFound())
  }

  return res.send({ plant })
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
    const newPlant = await Services.plantsService().create(plantArgs)

    console.warn('skipping integration of image linking / uploading')

    return res.status(201).send({ newPlant })
  } catch (error) {
    console.log('error:', error)
    return next(new BadRequest())
  }
})

plantsRouter.put('/:plantId', authMW, async (req, res, next) => {
  const { name, image, is_private } = req.body
  const plantArgs = {
    name,
    image,
    is_private: !!is_private
  }
  try {

    const updatedPlant = await Services.plantsService().update(req.params.plantId, req.user_id, plantArgs)

    return res.send({ updatedPlant })
  } catch (e) {
    if (e instanceof TError) {
      return res.status(e.status).send(e)
    } else {
      return res.status(500).send(e)
    }
  }
})

plantsRouter.delete('/:plantId', authMW, async (req, res, next) => {
  const plant = await Services.plantsService().deleteById(req.params.plantId, req.user_id)
  return res.status(203).send()
})
