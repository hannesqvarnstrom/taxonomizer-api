import tap from 'tap'
import { TestDb } from './setup'
import testLog from './test-log'

export default class Suite {
  tap = tap
  db: TestDb
  
  constructor (db: TestDb) {
    this.db = db
  }

  async parent (name: string, fn: (t: Tap.Test) => void) {
    return this.tap.test(name, fn)
  }

  setup (t: Tap.Test, resetDb = false) {
    testLog.suite(t.name)
  
    t.beforeEach(async t => {
      if (resetDb) await this.db.restart()
      testLog.start(t)
    })

    t.afterEach(async (t) => {
      testLog.succeed()
    })
    
    if (resetDb) {

      t.teardown(async () => {
        await this.db.teardown()
      })
    }
  }
}
