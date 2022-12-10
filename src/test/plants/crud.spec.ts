import { assert } from "console"
import supertest, { SuperTest } from "supertest"
import tap from "tap"
import { Plant } from "../../models"
import { api, testDb } from "../utils/setup"
import Suite from '../utils/suite'

const suite = new Suite(testDb)
const createPlant = (obj: {name: string, image?: string, is_private: boolean}, token?: string): supertest.Test => {
  let req = api.post('/api/plants')
  if (token) req.set('Authorization', 'Bearer ' + token)
  return req.send(obj)
}

const register = (args: object) => api
  .post('/api/auth/register')
  .send(args)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)

const login = (args: object) => api
  .post('/api/auth/login')
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

    const plant = response.body.newPlant
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

    const response = await api.get('/api/plants/' + plant.body.newPlant.id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)

    tap.ok(response.body.plant.name === 'Should work!')
    tap.ok(!response.body.plant.is_private)
  })

  child.test('update should fail when not logged in', async child => {
    const token = await authorize()
    const plant = await createPlant({
      name: 'Plant',
      is_private: false
    }, token)

    await api.put('/api/plants/' + plant.body.newPlant.id) // omitting auth credentials
      .expect(401)
  })

  child.test('update should fail when not owning plant', async child => {
    const token1 = await authorize()
    const plant = await createPlant({
      name: 'Planty',
      is_private: false
    }, token1)
    const token2 = await authorize('someoneelse@someemail.com')
    await api.put('/api/plants/' + plant.body.newPlant.id)
      .set('Authorization', 'Bearer ' + token2)
      .send({name: 'OtherPlanty'})
      .expect(404)
  })

  child.test('update should update plant with possible arguments', async child => {
    const token = await authorize()
    const plant = await createPlant({
      name: 'Bad Plant Name asdfg',
      is_private: true
    }, token)

    const updatedPlant = await api.put('/api/plants/' + plant.body.newPlant.id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'This name should be better',
        is_private: false
      })
      .expect(200)

      tap.ok(updatedPlant.body.updatedPlant.name === 'This name should be better')
      tap.ok(updatedPlant.body.updatedPlant.is_private === false)

      const refreshedPlant = await api.get('/api/plants/' + plant.body.newPlant.id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        
      tap.ok(refreshedPlant.body.plant.name === updatedPlant.body.updatedPlant.name)
      tap.ok(refreshedPlant.body.plant.is_private === updatedPlant.body.updatedPlant.is_private)
  })
})