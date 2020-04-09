const request = require('supertest')
process.env.PORT = 3333
const app = require('../app')

const testMsg = {"message":{"number": "+3161234567890", "content":"country bla"}}
describe('/stats endpoint', () => {
  it('gets 200', (done) => {
    request(app)
    .post('/stats')
    .send(testMsg)
    .set('Accept', 'application/json')
    .expect(200, done)
    .expect
  })
})

