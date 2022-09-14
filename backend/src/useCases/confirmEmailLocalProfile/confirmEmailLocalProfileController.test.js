const request = require('supertest');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

const createConfirmEmailToken = (profileId, profileName, options = {}) => {
  const {
    secret = process.env.CONFIRM_EMAIL_TOKEN_SECRET,
    expiresIn = process.env.CONFIRM_EMAIL_TOKEN_EXPIRATION_TIME,
  } = options;
  const payload = {
    iss: process.env.APP_URL,
    sub: profileId,
    name: profileName,
    jti: randomUUID(),
  };
  const emailConfirmationToken = jwt.sign(payload, secret, {
    expiresIn,
  });

  return emailConfirmationToken;
};

afterAll(async () => {
  Queue.close();
  await redisClient.delKeys('bull:*');
  await redisClient.quit();
  await knex.destroy();
});

describe('confirmEmailLocalProfileController', () => {
  it('Should confirm the user email if confirm email token is valid', async () => {
    const profile = {
      name: 'Maya_Valentina',
      email: 'maya-campos98@unilever.com',
      password: 'S3HjCf4wwN',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);
    const {
      id: profileId,
      name: profileName,
      is_active: statusBeforeConfirmation,
    } = await localProfileRepository.getLocalProfileByEmail(profile.email);
    const confirmEmailToken = createConfirmEmailToken(profileId, profileName);

    const response = await request(app).patch(
      `/confirmation/${confirmEmailToken}`
    );

    const { is_active: statusAfterConfirmation } =
      await localProfileRepository.getLocalProfileByEmail(profile.email);
    await localProfileRepository.deleteLocalProfile(profileId);
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    expect(response.status).toBe(200);
    expect(statusBeforeConfirmation).toBeFalsy();
    expect(statusAfterConfirmation).toBeTruthy();
  });

  it(`Should not confirm user email if token's user id is invalid`, async () => {
    const profile = {
      name: 'PedroHenrique',
      email: 'pedro_henrique_daluz@amplisat.com.br',
      password: 'ZjOOFyOpTO',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);
    const { id: profileId, name: profileName } =
      await localProfileRepository.getLocalProfileByEmail(profile.email);
    const confirmEmailToken = createConfirmEmailToken(profileId, profileName);
    await localProfileRepository.deleteLocalProfile(profileId);

    const response = await request(app).patch(
      `/confirmation/${confirmEmailToken}`
    );

    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'profile not found');
  });

  it('Should not confirm user email if token is expired', async () => {
    const profile = {
      name: 'Cecilia_Pereira',
      email: 'cecilia_heloisa_pereira@bwmtrade.com',
      password: 'fztgKNHtJe',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);
    const {
      id: profileId,
      name: profileName,
      is_active: statusBeforeConfirmation,
    } = await localProfileRepository.getLocalProfileByEmail(profile.email);
    const confirmEmailToken = await createConfirmEmailToken(
      profileId,
      profileName,
      {
        expiresIn: '10',
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 20));

    const response = await request(app).patch(
      `/confirmation/${confirmEmailToken}`
    );

    const { is_active: statusAfterConfirmation } =
      await localProfileRepository.getLocalProfileByEmail(profile.email);
    await localProfileRepository.deleteLocalProfile(profileId);
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'message',
      'invalid "confirm_email_token"'
    );
    expect(statusBeforeConfirmation).toBeFalsy();
    expect(statusAfterConfirmation).toBeFalsy();
  });

  it('Should not confirm user email if token is invalid', async () => {
    const confirmEmailToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW' +
      'IiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyf' +
      'Q.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const response = await request(app).patch(
      `/confirmation/${confirmEmailToken}`
    );

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'message',
      'invalid "confirm_email_token"'
    );
  });
});
