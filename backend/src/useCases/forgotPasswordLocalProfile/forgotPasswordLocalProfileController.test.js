const request = require('supertest');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

afterAll(async () => {
  Queue.close();
  await redisClient.delKeysAsync('bull:*');
  await redisClient.quitAsync();
  await knex.destroy();
});

describe('forgotPasswordLocalProfileController', () => {
  it(
    'Should send an email containing instructions for resetting the profile ' +
      'password when the email informed belongs ' +
      'to a profile registered in the system',
    async () => {
      const profile = {
        name: 'LuanCavalcanti',
        email: 'luan_cavalcanti@rafaeladson.com',
        password: 'TlnkWUFND7',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);

      const response = await request(app)
        .post('/forgotpassword')
        .send({ email: profile.email });

      profile.id = (
        await localProfileRepository.getLocalProfileByEmail(profile.email)
      ).id;
      profile.forgotPasswordToken = (
        await localAuthUtils.getForgotPasswordTokensFromStorage(profile.id)
      )[0];
      await localProfileRepository.deleteLocalProfile(profile.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profile.id,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeForgotPasswordTokenFromStorage(
        profile.id,
        profile.forgotPasswordToken
      );
      expect(response.status).toBe(200);
    }
  );

  it(
    'Should not send an email to reset the profile password ' +
      'if the email provided is invalid',
    async () => {
      const tests = [
        { email: '', message: '"email" is not allowed to be empty' },
        { email: null, message: '"email" must be a string' },
        { email: undefined, message: '"email" is required' },
        { email: true, message: '"email" must be a string' },
        { email: false, message: '"email" must be a string' },
        {
          email: Math.floor(Math.random() * 999999),
          message: '"email" must be a string',
        },
        { email: 'test.com', message: '"email" must be a valid email' },
        { email: 'test@test', message: '"email" must be a valid email' },
        {
          email: 'pietra-rocha72@aulicinobastos.com.br',
          message: 'profile not found',
        },
        {
          email: 'marianemarlisantos@estevao.ind.br',
          message: 'profile not found',
        },
        {
          email: 'pietrogustavodaconceicao@triunfante.com.br',
          message: 'profile not found',
        },
      ];

      for (const test of tests) {
        const response = await request(app)
          .post('/forgotpassword')
          .send({ email: test.email });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(test.message);
      }
    }
  );
});
