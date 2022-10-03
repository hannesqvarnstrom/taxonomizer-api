import { api, testDb } from "./utils/setup"
import Suite from './utils/suite'

const suite = new Suite(testDb)


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


suite.parent('Register', async child => {
  suite.setup(child, true)

  child.test('should handle correct input to register route', async (t) => {
    await register({ email: 'something@someone.com', password: '123456', passwordConfirmation: '123456' })
      .expect(201)
  })

  child.test('should handle poor email to register route', async (t) => {
    const res = await register({ email: '1%2. @ss', password: '123456', passwordConfirmation: '123456' })
      .expect(400)

    t.has(res.body.error.message, 'Bad Request')
  })

  child.test('should handle correct password format', async (t) => {
    await register({ email: 'something@someone.com', password: 'Xx123456', passwordConfirmation: 'Xx123456' })
      .expect(201)
  })

  child.test('should handle mismatch password', async t => {
    const res = await register({ email: 'something@someone.com', password: 'badcappy', passwordConfirmation: 'goodcappy' })
      .expect(400)

    t.has(res.body.error.message, 'Passwords do not match')
  })

  child.test('should handle duplicate emails', async t => {
    const args = {
      email: 'duplicate@hej.com',
      password: '123456',
      passwordConfirmation: '123456'
    }

    await register(args)
      .expect(201)

    const res = await register(args)
      .expect(400)

    t.has(res.body.error.message, 'Email already exists')
  })

})

suite.parent('Login', async child => {
  suite.setup(child, true)

  child.test('should allow login for existing user', async (t) => {
    const email = 'registereduser@taxonomizer.com'
    const password = 'cappyboiii123'

    const res = await register({
      email,
      password,
      passwordConfirmation: password
    })
      .expect(201)

    const res2 = await login({
      email,
      password
    })
      .expect(200)

    t.has(res2.body.expiresIn, 3600)
    t.match(res2.body.token, /^(?:[\w-]*\.){2}[\w-]*$/)
  })

  child.test('should disallow login for non-existing email-adress', async (t) => {
    const email = 'idonotexist@atall.com'
    const password = '123456'

    const res = await login({
      email, password,
    })
      .expect(400)

    t.has(res.body.error.message, 'No matching email or password')
  })

  child.test('should block faulty password', async t => {
    const email = 'registereduser@taxonomizer.com'
    const password = 'cappyboi'

    await register({
      email,
      password,
      passwordConfirmation: password
    })
      .expect(201)

    const res = await login({ email, password: password + 'nomnom' })
      .expect(400)

    t.has(res.body.error.message, 'No matching email or password')
  })
})

suite.parent('Auth checks', async child => {
  suite.setup(child, true)

  child.test('get user if exists works', async t => {
    const res = await api
      .get('/auth/am-i-logged-in')
      .expect(200)

    t.match(res.body.answer, 'no')

    await register({ email: 'someguy@hello.com', password: '123456', passwordConfirmation: '123456' }).expect(201)
    const loginRes = await login({ email: 'someguy@hello.com', password: '123456' }).expect(200)

    t.type(loginRes.body.token, 'string')

    const res2 = await api
      .get('/auth/am-i-logged-in')
      .set('Authorization', 'Bearer ' + loginRes.body.token)
      .expect(200)

    t.match(res2.body.answer, 'yes')
  })

  child.test('auth requiring middleware works', async t => {
    const email = 'someotherguy@hello.com'
    const password = '123456'

    await api.get('/auth/gate').expect(401)

    await register({ email, password, passwordConfirmation: password }).expect(201)
    const loginRes = await login({ email, password }).expect(200)

    await api.get('/auth/gate').set('Authorization', 'Bearer ' + loginRes.body.token).expect(200)
  })
})


