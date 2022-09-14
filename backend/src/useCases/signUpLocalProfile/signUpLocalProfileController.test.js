const request = require('supertest');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

afterAll(async () => {
  Queue.close();
  await redisClient.delKeys('bull:*');
  await redisClient.quit();
  await knex.destroy();
});

describe('signUpLocalProfileController', () => {
  it(
    'Should be able to create a new profile and ' +
      'return the accessToken and the refreshToken',
    async () => {
      const profile = {
        name: 'Victor_Raimundo',
        email: 'victor_darocha@asconinternet.com.br',
        password: 'eFol3JhMmu',
      };

      const response = await request(app).post('/signup').send(profile);

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        response.body.refresh_token
      );
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    }
  );

  it('Should not be able to create an existing profile', async () => {
    const profiles = [
      {
        name: 'GiovannaIsabel',
        email: 'giovanna-santos87@gameecia.com.br',
        password: '15wuGAxzlE',
      },
      {
        name: 'GiovannaIsabel',
        email: 'giovanna-santos88@gameecia.com.br',
        password: '15wuGAxzlE',
      },
      {
        name: 'GiIsabel',
        email: 'giovanna-santos87@gameecia.com.br',
        password: '15wuGAxzlE',
      },
      {
        name: 'GiovannaISABEL',
        email: 'giovanna-santos89@gameecia.com.br',
        password: '15wuGAxzlE',
      },
    ];

    const responses = [];
    responses[0] = await request(app).post('/signup').send(profiles[0]);
    responses[1] = await request(app).post('/signup').send(profiles[1]);
    responses[2] = await request(app).post('/signup').send(profiles[2]);
    responses[3] = await request(app).post('/signup').send(profiles[3]);

    const { id: profileId } =
      await localProfileRepository.getLocalProfileByEmail(profiles[0].email);
    await localProfileRepository.deleteLocalProfile(profileId);
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      responses[0].body.refresh_token
    );
    expect(responses[1].status).toBe(409);
    expect(responses[1].body.message).toBe('"name" unavailable');
    expect(responses[2].status).toBe(409);
    expect(responses[2].body.message).toBe('"email" unavailable');
    expect(responses[3].status).toBe(409);
    expect(responses[3].body.message).toBe('"name" unavailable');
  });

  it('Should not be able to create a profile with invalid data', async () => {
    const tests = [
      {
        profile: {
          name: 'Giovanna Isabel',
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wuGAxzlE',
        },
        message: '"name" must only contain alpha-numeric characters',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87',
          password: '15wuGAxzlE',
        },
        message: '"email" must be a valid email',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wu',
        },
        message: '"password" length must be at least 8 characters long',
      },
      {
        profile: {
          name: 1234,
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wuGAxzlE',
        },
        message: '"name" must be a string',
      },
      {
        profile: {
          name: true,
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wuGAxzlE',
        },
        message: '"name" must be a string',
      },
      {
        profile: {
          name: false,
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wuGAxzlE',
        },
        message: '"name" must be a string',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 9876,
          password: '15wuGAxzlE',
        },
        message: '"email" must be a string',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: true,
          password: '15wuGAxzlE',
        },
        message: '"email" must be a string',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: false,
          password: '15wuGAxzlE',
        },
        message: '"email" must be a string',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87@gameecia.com.br',
          password: 1516,
        },
        message: '"password" must be a string',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87@gameecia.com.br',
          password: true,
        },
        message: '"password" must be a string',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87@gameecia.com.br',
          password: false,
        },
        message: '"password" must be a string',
      },
      {
        profile: {
          name: '',
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wuGAxzlE',
        },
        message: '"name" is not allowed to be empty',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: '',
          password: '15wuGAxzlE',
        },
        message: '"email" is not allowed to be empty',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87@gameecia.com.br',
          password: '',
        },
        message: '"password" is not allowed to be empty',
      },
      {
        profile: {
          email: 'giovanna-santos87@gameecia.com.br',
          password: '15wuGAxzlE',
        },
        message: '"name" is required',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          password: '15wuGAxzlE',
        },
        message: '"email" is required',
      },
      {
        profile: {
          name: 'GiovannaIsabel',
          email: 'giovanna-santos87@gameecia.com.br',
        },
        message: '"password" is required',
      },
    ];

    for (const test of tests) {
      const response = await request(app).post('/signup').send(test.profile);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(test.message);
    }
  });
});
