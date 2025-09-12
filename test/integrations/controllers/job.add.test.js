const supertest = require('supertest');

const BASE_URL = 'http://localhost:1342/';
const CREATE_JOB = 'api/v1/job/create';

const token = '';

const requestParams = {
  'queues': ['ip']
};

describe('Helpers.job', () => {
  describe('#add()', () => {
    it('Data task inactive package', (done) => {
    // Log
      console.log(`[TEST][CREATE][REQ]: ${BASE_URL}${CREATE_JOB} - body=${JSON.stringify(requestParams)}`);
      // Execute it
      supertest(BASE_URL)
            .post(CREATE_JOB)
            .set({
              'Authorization': token,
            })
            .send(requestParams)
            .expect(200).end((err, res) => {
              if (err) {
                console.log('Error:', err.stack);
                return done(err);
              }
              console.log(`[TEST][CREATE][RES]: ${JSON.stringify(res.body, null, 2)}`);
              done();
            });
    });
  });

});
