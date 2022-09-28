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

describe('exitDeviceLocalProfileController', () => {
  it('Should be able to exit the device when the "device_id" provided is valid', async () => {
    const profile = {
      name: 'DanielaTeixeira',
      email: 'daniela_teixeira@weatherford.com',
      password: 'x2SCyj6b84',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByEmail(profile.email);
    const isRefreshTokenWhitelisted =
      await localAuthUtils.isRefreshTokenInStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
    const devicesResponse = await request(app)
      .get('/devices')
      .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

    const response = await request(app)
      .delete('/devices')
      .send({
        device_id: devicesResponse.body[0].id,
        password: profile.password,
      })
      .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

    const isRefreshTokenDeleted =
      !(await localAuthUtils.isRefreshTokenInStorage(
        profileId,
        signUpResponse.body.refresh_token
      ));
    await localProfileRepository.deleteLocalProfile(profileId);
    expect(isRefreshTokenWhitelisted).toBeTruthy();
    expect(response.status).toBe(200);
    expect(isRefreshTokenDeleted).toBeTruthy();
  });

  it(
    'Should not be able to exit the device with the "device_id" ' +
      'provided when password is invalid',
    async () => {
      const profile = {
        name: 'Isabela_Nunes',
        email: 'isabela_nunes@gamil.com',
        password: 'tKgtgKZA2Y',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);
      const devicesResponse = await request(app)
        .get('/devices')
        .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);
      const tests = [
        {
          body: { device_id: devicesResponse.body[0].id },
          status: 400,
          message: '"password" is required',
        },
        {
          body: {
            password: '',
            device_id: devicesResponse.body[0].id,
          },
          status: 400,
          message: '"password" is not allowed to be empty',
        },
        {
          body: {
            password: 8380,
            device_id: devicesResponse.body[0].id,
          },
          status: 400,
          message: '"password" must be a string',
        },
        {
          body: {
            password: true,
            device_id: devicesResponse.body[0].id,
          },
          status: 400,
          message: '"password" must be a string',
        },
        {
          body: {
            password: false,
            device_id: devicesResponse.body[0].id,
          },
          status: 400,
          message: '"password" must be a string',
        },
        {
          body: {
            password: 'KZA2YtKgtg',
            device_id: devicesResponse.body[0].id,
          },
          status: 400,
          message: 'incorrect password',
        },
      ];

      for (const [i, test] of tests.entries()) {
        tests[i].response = await request(app)
          .delete('/devices')
          .send(test.body)
          .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);
      }

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      for (const test of tests) {
        expect(test.response.status).toBe(test.status);
        expect(test.response.body.message).toBe(test.message);
      }
    }
  );

  it(
    'Should not be able to exit the device with the "device_id" ' +
      'provided when it is invalid',
    async () => {
      const profile = {
        name: 'MarcioFarias',
        email: 'marcioviniciusfarias@bassanpeixoto.adv.br',
        password: 'R3NnyAfh8a',
      };
      const tests = [
        {
          body: { password: profile.password },
          status: 400,
          message: '"device_id" is required',
        },
        {
          body: { password: profile.password, device_id: '' },
          status: 400,
          message: '"device_id" is not allowed to be empty',
        },
        {
          body: { password: profile.password, device_id: 7594 },
          status: 400,
          message: '"device_id" must be a string',
        },
        {
          body: { password: profile.password, device_id: true },
          status: 400,
          message: '"device_id" must be a string',
        },
        {
          body: { password: profile.password, device_id: false },
          status: 400,
          message: '"device_id" must be a string',
        },
        {
          body: {
            password: profile.password,
            device_id: '93d5aac9-0148-498c-8a54-bac2d40f765@',
          },
          status: 403,
          message: 'invalid "device_id"',
        },
      ];
      const signUpResponse = await request(app).post('/signup').send(profile);

      for (const [i, test] of tests.entries()) {
        tests[i].response = await request(app)
          .delete('/devices')
          .send(test.body)
          .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);
      }

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      for (const test of tests) {
        expect(test.response.status).toBe(test.status);
        expect(test.response.body.message).toBe(test.message);
      }
    }
  );
});
