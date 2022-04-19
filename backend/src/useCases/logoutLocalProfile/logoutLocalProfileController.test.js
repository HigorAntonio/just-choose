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

describe('logoutLocalProfileController', () => {
  it('Should be able to delete the refresh token provided when it is valid', async () => {
    const profile = {
      name: 'FelipeBrito',
      email: 'felipeaugustobrito@doucedoce.com.br',
      password: 'CZEDq1Nc1Z',
    };

    const {
      body: { access_token: accessToken, refresh_token: refreshToken },
    } = await request(app).post('/signup').send(profile);
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    const isRefreshTokenWhitelisted =
      (await redisClient.sismemberAsync(
        `refreshTokensProfile${profileId}`,
        refreshToken
      )) === 1;
    const response = await request(app)
      .delete('/logout')
      .send({ refresh_token: refreshToken })
      .set('Authorization', `Bearer ${accessToken}`);
    const isRefreshTokenDeleted =
      (await redisClient.sismemberAsync(
        `refreshTokensProfile${profileId}`,
        refreshToken
      )) === 0;

    expect(isRefreshTokenWhitelisted).toBeTruthy();
    expect(response.status).toBe(204);
    expect(isRefreshTokenDeleted).toBeTruthy();
    await localProfileRepository.deleteLocalProfile(profileId);
    await redisClient.flushdbAsync();
  });

  it(
    'Should not be able to delete the refresh token ' +
      'provided when it is invalid',
    async () => {
      const profile = {
        name: 'NelsonThales',
        email: 'nelson_teixeira@bol.com',
        password: '7Xp5UYWY1H',
      };
      const tests = [
        { body: {}, status: 400, message: '"refreshToken" is required' },
        {
          body: { refresh_token: '' },
          status: 400,
          message: '"refreshToken" is not allowed to be empty',
        },
        {
          body: { refresh_token: 53434 },
          status: 400,
          message: '"refreshToken" must be a string',
        },
        {
          body: { refresh_token: true },
          status: 400,
          message: '"refreshToken" must be a string',
        },
        {
          body: { refresh_token: false },
          status: 400,
          message: '"refreshToken" must be a string',
        },
        {
          body: {
            refresh_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwI' +
              'iwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeK' +
              'KF2QT4fwpMeJf36POk6yJV_adQssw5c',
          },
          status: 403,
          message: 'invalid "refresh_token"',
        },
      ];

      const {
        body: { access_token: accessToken },
      } = await request(app).post('/signup').send(profile);
      for (const test of tests) {
        const response = await request(app)
          .delete('/logout')
          .send(test.body)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(test.status);
        expect(response.body.message).toBe(test.message);
      }
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await localProfileRepository.deleteLocalProfile(profileId);
      await redisClient.flushdbAsync();
    }
  );

  it(
    'Should not be able to delete the refresh token ' +
      'provided when it is not whitelisted',
    async () => {
      const profile = {
        name: 'VitoriaSophia',
        email: 'vitoria.claudia.viana@reconciliare.com.br',
        password: '0UPWZjUU7p',
      };

      const {
        body: { access_token: accessToken, refresh_token: refreshToken },
      } = await request(app).post('/signup').send(profile);
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await redisClient.sremAsync(
        `refreshTokensProfile${profileId}`,
        refreshToken
      );
      const response = await request(app)
        .delete('/logout')
        .send({ refresh_token: refreshToken })
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('"refresh_token" not found');
      await localProfileRepository.deleteLocalProfile(profileId);
      await redisClient.flushdbAsync();
    }
  );

  it(
    'Should not be able to delete the refresh token provided when it ' +
      'does not belong to the profile it is trying to delete',
    async () => {
      const tests = [
        {
          profile: {
            name: 'Lorena_Farias',
            email: 'lorena.carla.farias@wredenborg.se',
            password: 'YsnsfZeyeq',
          },
        },
        {
          profile: {
            name: 'ValentinaAlmeida',
            email: 'valentina-almeida71@construtoracostanorte.com.br',
            password: '3pZneP2DrT',
          },
        },
        {
          profile: {
            name: 'OtavioBarbosa',
            email: 'otavio.luis.barbosa@innovatis.com.br',
            password: 'o45gluG6PB',
          },
        },
      ];

      for (const [i, test] of tests.entries()) {
        const {
          body: { access_token: accessToken, refresh_token: refreshToken },
        } = await request(app).post('/signup').send(test.profile);
        const { id: profileId } =
          await localProfileRepository.getLocalProfileByName(test.profile.name);
        tests[i].accessToken = accessToken;
        tests[i].refreshToken = refreshToken;
        tests[i].profileId = profileId;
      }

      for (const [i, test] of tests.entries()) {
        const accessToken =
          i === tests.length - 1
            ? tests[0].accessToken
            : tests[i + 1].accessToken;
        tests[i].response = await request(app)
          .delete('/logout')
          .send({ refresh_token: test.refreshToken })
          .set('Authorization', `Bearer ${accessToken}`);
        tests[i].isRefreshTokenWhitelisted =
          (await redisClient.sismemberAsync(
            `refreshTokensProfile${tests[i].profileId}`,
            tests[i].refreshToken
          )) === 1;
      }

      for (const test of tests) {
        expect(test.response.status).toBe(403);
        expect(test.response.body.message).toBe('invalid profile');
        expect(test.isRefreshTokenWhitelisted).toBeTruthy();
        await localProfileRepository.deleteLocalProfile(test.profileId);
      }
      await redisClient.flushdbAsync();
    }
  );
});
