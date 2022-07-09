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

describe('updatePasswordLocalProfileController', () => {
  it(
    'Should update profile password if user is authenticated ' +
      'and inform valid current password and valid new password',
    async () => {
      const profile = {
        name: 'KamillyPeixoto',
        email: 'kamilly_natalia_peixoto@ugeda.com.br',
        password: 'u2FOzSYk7i',
      };
      const newPassword = 'SYk7iu2FOz';
      const signUpResponse = await request(app).post('/signup').send(profile);
      const { password: passwordBefore } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      const comparePasswordBefore = localAuthUtils.comparePassword(
        profile.password,
        passwordBefore
      );

      const response = await request(app)
        .patch('/updatepassword')
        .set('Authorization', `Bearer ${signUpResponse.body.access_token}`)
        .send({
          current_password: profile.password,
          new_password: newPassword,
        });

      const { id: profileId, password: passwordAfter } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      const comparePasswordAfter = localAuthUtils.comparePassword(
        newPassword,
        passwordAfter
      );
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(200);
      expect(comparePasswordBefore).toBeTruthy();
      expect(comparePasswordAfter).toBeTruthy();
    }
  );

  it(
    'Should not update profile password if user inform ' +
      'invalid current password',
    async () => {
      const profile = {
        name: 'Martin_Matheus',
        email: 'martin_bernardes@atiara.com.br',
        password: 'J2ChWbdWG4',
      };
      const tests = [
        {
          body: { new_password: 'bdWG4J2ChW' },
          status: 400,
          message: '"current_password" is required',
        },
        {
          body: { current_password: '', new_password: 'bdWG4J2ChW' },
          status: 400,
          message: '"current_password" is not allowed to be empty',
        },
        {
          body: { current_password: 41644, new_password: 'bdWG4J2ChW' },
          status: 400,
          message: '"current_password" must be a string',
        },
        {
          body: { current_password: true, new_password: 'bdWG4J2ChW' },
          status: 400,
          message: '"current_password" must be a string',
        },
        {
          body: { current_password: false, new_password: 'bdWG4J2ChW' },
          status: 400,
          message: '"current_password" must be a string',
        },
        {
          body: { current_password: 'bdWChWG4J2', new_password: 'bdWG4J2ChW' },
          status: 400,
          message: 'incorrect password',
        },
      ];
      const signUpResponse = await request(app).post('/signup').send(profile);

      for (const [i, test] of tests.entries()) {
        tests[i].response = await request(app)
          .patch('/updatepassword')
          .send(test.body)
          .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);
      }

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
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
    'Should not update profile password if user ' +
      'inform invalid new password',
    async () => {
      const profile = {
        name: 'SabrinaNeves',
        email: 'sabrinasebastianadasneves@santander.com.br',
        password: 'mOJrruoBMC',
      };
      const tests = [
        {
          body: { current_password: profile.password },
          status: 400,
          message: '"new_password" is required',
        },
        {
          body: { current_password: profile.password, new_password: '' },
          status: 400,
          message: '"new_password" is not allowed to be empty',
        },
        {
          body: { current_password: profile.password, new_password: 83756 },
          status: 400,
          message: '"new_password" must be a string',
        },
        {
          body: { current_password: profile.password, new_password: true },
          status: 400,
          message: '"new_password" must be a string',
        },
        {
          body: { current_password: profile.password, new_password: false },
          status: 400,
          message: '"new_password" must be a string',
        },
        {
          body: { current_password: profile.password, new_password: 'bdWG4' },
          status: 400,
          message: '"new_password" length must be at least 8 characters long',
        },
        {
          body: {
            current_password: profile.password,
            new_password:
              'dde6eafb85ffa04d6f2944292097a06ff' +
              '826b08a296d073a115e937d0ff39545e',
          },
          status: 400,
          message:
            '"new_password" length must be less than or ' +
            'equal to 64 characters long',
        },
      ];
      const signUpResponse = await request(app).post('/signup').send(profile);

      for (const [i, test] of tests.entries()) {
        tests[i].response = await request(app)
          .patch('/updatepassword')
          .send(test.body)
          .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);
      }

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
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

  it('Should not update profile password if user is invalid', async () => {
    const profile = {
      name: 'Andrea_Freitas',
      email: 'andrea_freitas@4now.com.br',
      password: 'jWlyMsSsbm',
    };
    const newPassword = 'sSsbmjWlyM';
    const signUpResponse = await request(app).post('/signup').send(profile);
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);

    const response = await request(app)
      .patch('/updatepassword')
      .set('Authorization', `Bearer ${signUpResponse.body.access_token}`)
      .send({
        current_password: profile.password,
        new_password: newPassword,
      });

    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'profile not found');
  });
});
