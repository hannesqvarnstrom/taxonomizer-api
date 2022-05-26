import { api, testDb } from './utils/setup';
import Suite from './utils/suite';

const suite = new Suite(testDb)

suite.parent('GET /', async (child) => {
  suite.setup(child)

  child.test('should return 200 OK', async () => {
    await api.get('/')
      .expect(200)
  })
})
