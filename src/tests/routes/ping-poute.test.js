const request = require('supertest');
const app = require('../../express');

const BASE_PATH = '/api/v1';

describe('Route /ping', function () {
  describe('/ [GET]', function () {
    test('responds with json', async () => {
      const { body, error } = await request(app)
        .get(BASE_PATH + '/ping')
        .query();

      expect(body).toBeDefined();
      expect(error).toBeFalsy();
    });
  });

  describe('/health-check [POST]', function () {
    test('with invalid body', async () => {
      const { body, error } = await request(app)
        .post(BASE_PATH + '/ping/health-check')
        .send({});

      expect(body).toBeDefined();
      expect(error).toBeTruthy();
    });

    test('with valid body', async () => {
      const { body, error } = await request(app)
        .post(BASE_PATH + '/ping/health-check')
        .send({ withEnv: true });

      expect(body).toEqual(
        expect.objectContaining({
          result: expect.objectContaining({
            environment: expect.anything(),
          }),
        })
      );
      expect(error).toBeFalsy();
    });
  });
});
