import { NotFound } from "../middlewares/errors";
import { Plant, PlantRepository } from "../models";

class PlantsService {
    constructor() { }

    getPublicPlants = (userId: ID) => {
        const q = PlantRepository.getViewable(userId)
        return q
    }

    publicFindById = (plantId: ID, userId?: ID) => {
        const q = PlantRepository.findById(userId)
        return q
    }

    create = (plantArgs: { name: string, image?: string, is_private: boolean, user_id: ID }) => {
      return PlantRepository.create(plantArgs)
    }

    privateFindById = (plantId: ID, userId?: ID) => {
        return Plant.bindUserId(userId).findById(plantId).first()
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

        return plant.$query().patch(plantUpdateArgs).returning('*')
    }

    deleteById = async (plantId: ID, userId: ID) => {
        const plant = await this.privateFindById(plantId, userId)
        await plant.$query().delete()
    }
}

export default PlantsService

export type ID = number | string