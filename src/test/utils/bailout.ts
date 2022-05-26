import { testDb } from './setup'

console.log('bail out occurred, tearing down the rest of the db')
testDb.teardown()

