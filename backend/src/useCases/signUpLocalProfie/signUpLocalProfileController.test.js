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
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      const { id: profileId } = await localProfileRepository.getProfileByName(
        profile.name
      );
      await localProfileRepository.deleteProfile(profileId);
      await redisClient.flushdbAsync();
    }
  );

  it('Should not be able to create an existing profile', async () => {
    const profile = {
      name: 'GiovannaIsabel',
      email: 'giovanna-santos87@gameecia.com.br',
      password: '15wuGAxzlE',
    };
    await request(app).post('/signup').send(profile);
    const response = await request(app).post('/signup').send(profile);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('"name" unavailable');
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
    for (test of tests) {
      const response = await request(app).post('/signup').send(test.profile);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(test.message);
    }
  });
});
