const request = require('supertest');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');

afterAll(async () => {
  Queue.close();
  await redisClient.quitAsync();
  await knex.destroy();
});

describe('refreshAuthTokenLocalProfileController', () => {
  it(
    'Should be able to create and return a new accessToken ' +
      'upon receiving a valid refreshToken',
    async () => {
      const profile = {
        name: 'LuanBenicio',
        email: 'luanvictormoraes@outlock.com.br',
        password: 'RYIWOxtwuk',
      };

      const {
        body: { refresh_token: refreshToken },
      } = await request(app).post('/signup').send(profile);
      const response = await request(app)
        .post('/token')
        .send({ refresh_token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await localProfileRepository.deleteLocalProfile(profileId);
      await redisClient.flushdbAsync();
    }
  );

  it(
    'Should not be able to create and return a new accessToken ' +
      'upon receiving a invalid refreshToken',
    async () => {
      const tests = [
        { body: {}, status: 400, message: '"refresh_token" is required' },
        {
          body: { refresh_token: '' },
          status: 400,
          message: '"refresh_token" is not allowed to be empty',
        },
        {
          body: { refresh_token: 53434 },
          status: 400,
          message: '"refresh_token" must be a string',
        },
        {
          body: { refresh_token: true },
          status: 400,
          message: '"refresh_token" must be a string',
        },
        {
          body: { refresh_token: false },
          status: 400,
          message: '"refresh_token" must be a string',
        },
        {
          body: {
            refresh_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ4NzcwNTIw' +
              'LCJleHAiOjE2NDg4NTY5MjB9.vsNOSUtA5gBlwIbE5ZxnQDFZ0XyCIjNOZZWX56yIoCo',
          },
          status: 401,
          message: 'invalid "refresh_token"',
        },
      ];

      for (const test of tests) {
        const response = await request(app).post('/token').send(test.body);

        expect(response.status).toBe(test.status);
        expect(response.body.message).toBe(test.message);
      }
    }
  );

  it(
    'Should not be able to create and return a new accessToken ' +
      'upon receiving a refreshToken that is not whitelisted',
    async () => {
      const profile = {
        name: 'EmanuelBarros',
        email: 'emanuelnoahbarros@ruilacos.com.br',
        password: 'm6pdPzmBaY',
      };

      const {
        body: { refresh_token: refreshToken },
      } = await request(app).post('/signup').send(profile);
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await redisClient.sremAsync(
        `refreshTokensProfile${profileId}`,
        refreshToken
      );
      const response = await request(app)
        .post('/token')
        .send({ refresh_token: refreshToken });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('"refresh_token" not found');
      await localProfileRepository.deleteLocalProfile(profileId);
      await redisClient.flushdbAsync();
    }
  );
});
