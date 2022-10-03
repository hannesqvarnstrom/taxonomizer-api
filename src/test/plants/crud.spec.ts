import { assert } from "console"
import Objection from "objection"
import supertest, { SuperTest } from "supertest"
import tap from "tap"
import { Plant } from "../../models"
import { api, testDb } from "../utils/setup"
import Suite from '../utils/suite'

const suite = new Suite(testDb)
const createPlant = (obj: Objection.PartialModelGraph<Plant>, token?: string): supertest.Test => {
  let req = api.post('/plants')
  if (token) req.set('Authorization', 'Bearer ' + token)
  return req.send(obj)
}

const register = (args: object) => api
  .post('/auth/register')
  .send(args)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)

const login = (args: object) => api
  .post('/auth/login')
  .send(args)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)

const authorize = async (email: string = 'admin@admin.com'): Promise<string | undefined> => {
  const password = '12356'
  const registerArgs = {
    email,
    password,
    passwordConfirmation: password
  }
  await register(registerArgs)
  const loginArgs = {
    email,
    password
  }
  const { body } = await login(loginArgs)
  return body.token
}

const authHeader = (token: string) => {
  return ['Authorization', 'Bearer ' + token]
}

suite.parent('plants CRUD', async child => {
  suite.setup(child, true)

  child.test('create while not logged in should not work', async child => {
    await createPlant({
      name: 'Should not work',
      is_private: false,
    })
      .expect(401)
  })

  child.test('create while logged in should work', async child => {
    const token = await authorize()

    const response = await createPlant({
      name: 'Should work!',
      is_private: false
    }, token)
      .expect(201)

    tap.ok(response.body.newPlant.name === 'Should work!')
    const plant: Plant = Plant.fromJson(response.body.newPlant)
    tap.ok(plant.name === 'Should work!')
    tap.ok(!plant.is_private)
  })

  child.test('get plant should work', async child => {
    const token = await authorize()
    const plant = await createPlant({
      name: 'Should work!',
      is_private: false
    }, token)
      .expect(201)

    const response = await api.get('/plants/' + plant.body.newPlant.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)

    tap.ok(response.body.plant.name === 'Should work!')
    tap.ok(!response.body.plant.is_private)
  })
})