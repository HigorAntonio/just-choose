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

describe('resendConfirmEmailLocalProfileController', () => {
  it('Should resend confirm email if user is authenticated', async () => {
    const profile = {
      name: 'AnaluMoraes',
      email: 'analu_moraes@accor.com.br',
      password: 'jEcx0I9dTK',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);

    const response = await request(app)
      .get('/confirmation')
      .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    expect(response.status).toBe(200);
  });

  it('Should not resend confirm email if user is invalid', async () => {
    const profile = {
      name: 'Martin_Rodrigues',
      email: 'martin_thiago_rodrigues@policiacivil.sp.gov.br',
      password: 'yx0fNyNYz8',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);

    const response = await request(app)
      .get('/confirmation')
      .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'profile not found');
  });

  it(
    'Should not resend confirm email if profile email is ' +
      'already confirmed',
    async () => {
      const profile = {
        name: 'OliviaJesus',
        email: 'oliviacarlajesus@hotrmail.com',
        password: 'RcCFjWkDgR',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await localProfileRepository.updateIsActiveLocalProfile(profileId, true);

      const response = await request(app)
        .get('/confirmation')
        .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        'message',
        'profile email already confirmed'
      );
    }
  );
});
