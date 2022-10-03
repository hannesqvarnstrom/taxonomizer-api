import { NotFound } from "../middlewares/errors";
import { Plant } from "../models";

class PlantsService {
    constructor() { }

    getPublicPlants = (userId: ID) => {
        const q = Plant.wherePublicOrOwned(userId)
        return q
    }

    publicFindById = (plantId: ID, userId?: ID) => {
        const q = Plant.wherePublicOrOwned(userId).findById(plantId).first()
        return q
    }

    create = (plantArgs: { name: string, image?: string, is_private: boolean, user_id: ID }) => {
        return Plant.query().insert(plantArgs)
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

type ID = number | string