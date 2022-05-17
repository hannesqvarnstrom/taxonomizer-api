import { Parentage } from "../models/Parentage";
import { PlantsCreateArgs } from "src/models/Plant";
import knex, { Plant, User, PlantParentage } from "../models";
import { assert } from "console";
import { Transaction } from "objection";

const plants = [
  {
    genus_name: 'Kohleria',
    species_name: 'hirsuta',
    cultivar_name: '',
    fertility: true,
  },
  {
    genus_name: 'Kohleria',
    species_name: 'tubiflora',
    cultivar_name: '',
    fertility: true,
  },
  {// first child
    genus_name: 'Kohleria',
    species_name: '',
    cultivar_name: '\'Bajsi\'',
    fertility: true,
  },
  {// other species
    genus_name: 'Kohleria',
    species_name: 'inaequalis',
    cultivar_name: '',
    fertility: true,
  },
  {// child of bajsi and inaequalis
    genus_name: 'Kohleria',
    species_name: '',
    cultivar_name: '\'Bajsiqualis\'',
    fertility: true,
  },
  {// child of hirsuta single
    genus_name: 'Kohleria',
    species_name: '',
    cultivar_name: '\'Hirsuta2\'',
    fertility: true,
  },
  {
    genus_name: 'Kohleria',
    species_name: '',
    cultivar_name: '\'Magisk Flaskiana\''
  }
]

const insertPlant = async (plant: any, userId: any, trx: Transaction) => {
  return await Plant.query(trx).insert(
    { ...plant, user_id: userId }
  )
}

const insertParentage = async (plants: Plant[], child: Plant, userId: any, trx: Transaction) => {
  let parentageData = {}
  const parentage = await Parentage.query(trx).insert({ user_id: userId })
  if (plants.length > 1) {
    parentageData = [
      {
        plant_id: plants[0].id,
        type: 'pollen',
        parentage_id: parentage.id
      },
      {
        plant_id: plants[1].id,
        type: 'seed',
        parentage_id: parentage.id
      }
    ]

  } else {
    parentageData = {
      plant_id: plants[0].id,
      type: 'single',
      parentage_id: parentage.id
    }
  }
  let result = await PlantParentage.query(trx).insertGraph(parentageData)

  await child.setParentage(parentage.id, trx)
}

export const main = async () => {
  await knex.transaction(async trx => {
    const user = await User
    .query(trx)
    .insertAndFetch(
      {
        firstName: 'admin',
        lastName: 'adminsson',
        email: 'admin@admin.com',
        password: '$2b$10$rz0sIszIRBmwPJsdJWmE8ugOcTx30ltYkvjQiul274aqVKvyjUF1a'
      }
      )
      console.log('user:', user)

    const insertedPlants = []
    for (const plant of plants) {
      const insertedPlant = await insertPlant(plant, user.id, trx)
      insertedPlants.push(insertedPlant)
    }

    const parentages = [
      {
        parents: [
          insertedPlants[0],
          insertedPlants[1]
        ],
        child: insertedPlants[2]
      },
      {
        parents: [
          insertedPlants[2],
          insertedPlants[3]
        ],
        child: insertedPlants[4]
      }
      ,
      {
        parents: [
          insertedPlants[0],
        ],
        child: insertedPlants[5]
      },
      {
        parents: [
          insertedPlants[0],
          insertedPlants[3]
        ],
        child: insertedPlants[6]
      }
    ]

    for (const parentage of parentages) {
      await insertParentage(parentage.parents, parentage.child, user.id, trx)
    }
    console.log('Done! Displaying results:')
    
    let plantsAfter : any[] = await user.plants(trx)

    // plantsAfter = await Promise.all(plantsAfter.map(async (plant: Plant) => {
    //   const family = await plant.family(trx)
    //   return {
    //     ...plant,
    //     family
    //   }
    // }))

    // plantsAfter.map(plant => {
    //   return {...plant, parentage: plant.rela}
    // })
    const testFamily = await plantsAfter[2].family()
    console.log(testFamily)
    // console.log((plantsAfter[2].family))
    throw new Error('Rollback')
  })


}
