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
  it('Should be able to delete the refresh token provided when it is valid', async () => {
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

    const response = await request(app)
      .delete('/devices')
      .send({
        password: profile.password,
        refresh_token: signUpResponse.body.refresh_token,
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
    'Should not be able to delete the refresh token ' +
      'provided when password is invalid',
    async () => {
      const profile = {
        name: 'Isabela_Nunes',
        email: 'isabela_nunes@gamil.com',
        password: 'tKgtgKZA2Y',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);
      const tests = [
        {
          body: { refresh_token: signUpResponse.body.refresh_token },
          status: 400,
          message: '"password" is required',
        },
        {
          body: {
            password: '',
            refresh_token: signUpResponse.body.refresh_token,
          },
          status: 400,
          message: '"password" is not allowed to be empty',
        },
        {
          body: {
            password: 8380,
            refresh_token: signUpResponse.body.refresh_token,
          },
          status: 400,
          message: '"password" must be a string',
        },
        {
          body: {
            password: true,
            refresh_token: signUpResponse.body.refresh_token,
          },
          status: 400,
          message: '"password" must be a string',
        },
        {
          body: {
            password: false,
            refresh_token: signUpResponse.body.refresh_token,
          },
          status: 400,
          message: '"password" must be a string',
        },
        {
          body: {
            password: 'KZA2YtKgtg',
            refresh_token: signUpResponse.body.refresh_token,
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
    'Should not be able to delete the refresh token ' +
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
          message: '"refresh_token" is required',
        },
        {
          body: { password: profile.password, refresh_token: '' },
          status: 400,
          message: '"refresh_token" is not allowed to be empty',
        },
        {
          body: { password: profile.password, refresh_token: 7594 },
          status: 400,
          message: '"refresh_token" must be a string',
        },
        {
          body: { password: profile.password, refresh_token: true },
          status: 400,
          message: '"refresh_token" must be a string',
        },
        {
          body: { password: profile.password, refresh_token: false },
          status: 400,
          message: '"refresh_token" must be a string',
        },
        {
          body: {
            password: profile.password,
            refresh_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwI' +
              'iwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeK' +
              'KF2QT4fwpMeJf36POk6yJV_adQssw5c',
          },
          status: 403,
          message: 'invalid "refresh_token"',
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

  it(
    'Should not be able to delete the refresh token ' +
      'provided when it is not whitelisted',
    async () => {
      const profile = {
        name: 'LeviBruno',
        email: 'levibrunodacunha@nine9.com.br',
        password: 'xezr5OHtW5',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );

      const response = await request(app)
        .delete('/devices')
        .send({
          password: profile.password,
          refresh_token: signUpResponse.body.refresh_token,
        })
        .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('"refresh_token" not found');
    }
  );

  it(
    'Should not be able to delete the refresh token provided when it ' +
      'does not belong to the profile it is trying to delete',
    async () => {
      const tests = [
        {
          profile: {
            name: 'LouisePires',
            email: 'louise-pires98@archosolutions.com.br',
            password: '2l7TEl7wmQ',
          },
        },
        {
          profile: {
            name: 'Jorge_Caldeira',
            email: 'jorge_caldeira@edpbr.com.br',
            password: 'myQYKZMgWO',
          },
        },
        {
          profile: {
            name: 'KaueEnrico',
            email: 'kaue.enrico.lima@prcondominios.com.br',
            password: 'oJW28jXpzX',
          },
        },
      ];
      for (const [i, test] of tests.entries()) {
        const signUpResponse = await request(app)
          .post('/signup')
          .send(test.profile);
        const { id: profileId } =
          await localProfileRepository.getLocalProfileByEmail(
            test.profile.email
          );
        tests[i].accessToken = signUpResponse.body.access_token;
        tests[i].refreshToken = signUpResponse.body.refresh_token;
        tests[i].profileId = profileId;
      }
      for (const [i, test] of tests.entries()) {
        const accessToken =
          i === tests.length - 1
            ? tests[0].accessToken
            : tests[i + 1].accessToken;

        tests[i].response = await request(app)
          .delete('/devices')
          .send({
            password: test.profile.password,
            refresh_token: test.refreshToken,
          })
          .set('Authorization', `Bearer ${accessToken}`);

        tests[i].isRefreshTokenWhitelisted =
          await localAuthUtils.isRefreshTokenInStorage(
            test.profileId,
            test.refreshToken
          );
      }
      for (const test of tests) {
        await localProfileRepository.deleteLocalProfile(test.profileId);
        await localAuthUtils.removeRefreshTokenFromStorage(
          test.profileId,
          test.refreshToken
        );
      }
      for (const test of tests) {
        expect(test.response.status).toBe(403);
        expect(test.response.body.message).toBe('invalid "profile_id"');
        expect(test.isRefreshTokenWhitelisted).toBeTruthy();
      }
    }
  );
});
