
import t from 'tap'
import { api, testDb } from './utils/setup';
import Suite from './utils/suite';

const suite = new Suite(testDb)

suite.parent('Error pages', async (child) => {
  suite.setup(child)

  child.test('should return 404 for not existing page', async () => {
    await api.get('/fake-page')
      .expect(404)
  })
})

