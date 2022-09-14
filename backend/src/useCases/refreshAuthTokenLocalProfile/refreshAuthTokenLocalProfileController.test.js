const request = require('supertest');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

const createRefreshToken = async (profileId, profileName, options = {}) => {
  const {
    secret = process.env.REFRESH_TOKEN_SECRET,
    expiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  } = options;
  const payload = {
    iss: process.env.APP_URL,
    sub: profileId,
    name: profileName,
    jti: randomUUID(),
  };
  const refreshToken = jwt.sign(payload, secret, {
    expiresIn,
  });
  const device = {
    os: 'test_os',
    browser: 'test_browser',
  };
  await localAuthUtils.storeRefreshToken(profileId, refreshToken, device);
  return refreshToken;
};

afterAll(async () => {
  Queue.close();
  await redisClient.delKeys('bull:*');
  await redisClient.quit();
  await knex.destroy();
});

describe('refreshAuthTokenLocalProfileController', () => {
  it(
    'Should be able to create and return a new accessToken ' +
      'and a new refreshToken upon receiving a valid refreshToken',
    async () => {
      const profile = {
        name: 'LuanBenicio',
        email: 'luanvictormoraes@outlock.com.br',
        password: 'RYIWOxtwuk',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);

      const response = await request(app)
        .post('/token')
        .send({ refresh_token: signUpResponse.body.refresh_token });

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      const isRefreshTokenWhitelisted =
        await localAuthUtils.isRefreshTokenInStorage(
          profileId,
          signUpResponse.body.refresh_token
        );
      const isNewRefreshTokenWhitelisted =
        await localAuthUtils.isRefreshTokenInStorage(
          profileId,
          response.body.refresh_token
        );
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        response.body.refresh_token
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(signUpResponse.body.refresh_token).not.toEqual(
        response.body.refresh_token
      );
      expect(isRefreshTokenWhitelisted).toBeFalsy();
      expect(isNewRefreshTokenWhitelisted).toBeTruthy();
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
      'upon receiving a expired refreshToken',
    async () => {
      const profile = {
        name: 'Mirella_Fabiana',
        email: 'mirella_fabiana_cortereal@ipek.net.br',
        password: 'x8eiIEMBt5',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);
      const { id: profileId, name: profileName } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      const refreshToken = await createRefreshToken(profileId, profileName, {
        expiresIn: '10',
      });
      await new Promise((resolve) => setTimeout(resolve, 20));

      const response = await request(app)
        .post('/token')
        .send({ refresh_token: refreshToken });

      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        refreshToken
      );
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid "refresh_token"');
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
      const signUpResponse = await request(app).post('/signup').send(profile);
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );

      const response = await request(app)
        .post('/token')
        .send({ refresh_token: signUpResponse.body.refresh_token });

      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('"refresh_token" not found');
    }
  );
});
