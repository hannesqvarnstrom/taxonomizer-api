import { NotFound } from "../middlewares/errors";
import { Plant, PlantRepository } from "../models";

class PlantsService {
  constructor() { }

  getPublicPlants = (userId: ID) => {
    const q = PlantRepository.getViewable(userId)
    return q
  }

  publicFindById = (plantId: ID, userId?: ID) => {
    const q = PlantRepository.findById(plantId, userId)
    return q
  }

  create = (plantArgs: { name: string, image?: string, is_private: boolean, user_id: number | string }) => {
    const args = {
      ...plantArgs,
      user_id: Number(plantArgs.user_id)
    }
    return PlantRepository.create(args)
  }

  privateFindById = async (plantId: ID, userId?: ID) => {
    const plant = await PlantRepository.findById(plantId, userId, { owned: true })
    return plant
  }

  update = async (plantId: ID, userId: ID, plantUpdateArgs: {
    name?: string,
    image?: string,
    is_private?: boolean
  }) => {
    const plant = await this.privateFindById(plantId, userId)

    if (!plant) {
      throw new NotFound()
    }

    return PlantRepository.update(plantId, plantUpdateArgs)
  }

  deleteById = async (plantId: ID, userId: ID) => {
    const plant = await this.privateFindById(plantId, userId)
    if (!plant) {
      throw new NotFound()
    }

    return PlantRepository.deleteById(plantId)
  }
}

export default PlantsService

export type ID = number | string