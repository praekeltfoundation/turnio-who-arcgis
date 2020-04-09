const request = require('supertest')
process.env.PORT = 3333
const app = require('../app')

describe('/stats endpoint', () => {
  it('should retrieve data based on a phonenumber', (done) => {
    const testMsg = {
      "message": {
        "number": "+31612345678",
        "content":"country bla"
      }
    }
    request(app)
    .post('/stats')
    .send(testMsg)
    .set('Accept', 'application/json')
    .expect(200, done)
  })
  it('should not be able to retrieve the country code', (done) => {
    const testMsg = {
      "message": {
        "number": "+3161234567890",
        "content":"country bla"
      }
    }
    request(app)
    .post('/stats')
    .send(testMsg)
    .set('Accept', 'application/json')
    .expect(200, done)
    .expect({country: "unknown"})
  })
})