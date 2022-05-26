const request = require('supertest');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const uaParser = require('ua-parser-js');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

const createRefreshToken = async (profileId, uastring, options = {}) => {
  const {
    secret = process.env.REFRESH_TOKEN_SECRET,
    expiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  } = options;
  const payload = {
    iss: process.env.APP_URL,
    sub: profileId,
    jti: randomUUID(),
  };
  const refreshToken = jwt.sign(payload, secret, {
    expiresIn,
  });
  const ua = uaParser(uastring);
  // TODO: Obter informações de localização do usuário através do ip (estado, país) e armazená-las no token
  const device = {
    os: ua.os.name,
    browser: ua.browser.name,
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

describe('devicesLocalProfileController', () => {
  it(
    'Should be able to return the list of devices on which the ' +
      'profile has connected if the request is made informing the ' +
      'authentication data',
    async () => {
      const profile = {
        name: 'LeviCardoso',
        email: 'levi_noah_cardoso@hidracom.com.br',
        password: 'u77ik8lidX',
      };
      const signUpResponse = await request(app)
        .post('/signup')
        .send(profile)
        .set(
          'User-Agent',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/100.0.4896.162 Safari/537.36'
        );

      const response = await request(app)
        .get('/devices')
        .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('os', 'Linux');
      expect(response.body[0]).toHaveProperty('browser', 'Chrome');
    }
  );

  it(
    'Should not be able to return the list of devices on which the ' +
      'profile has connected if the request is made when the user ' +
      'is not authenticated',
    async () => {
      const profile = {
        name: 'Lucia_Mariah',
        email: 'luciamariahdapaz@bhcervejas.com.br',
        password: 'rSMAiqYh8a',
      };
      const signUpResponse = await request(app)
        .post('/signup')
        .send(profile)
        .set(
          'User-Agent',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/100.0.4896.162 Safari/537.36'
        );

      const response = await request(app).get('/devices');

      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await localProfileRepository.deleteLocalProfile(profileId);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'message',
        'no "access_token" provided'
      );
    }
  );

  it(
    'Should remove information from devices where the ' +
      'refresh token has expired',
    async () => {
      const tests = [
        {
          userAgent:
            'Mozilla/5.0 (X11; Linux x86_64; rv:100.0) ' +
            'Gecko/20100101 Firefox/100.0',
          os: 'Linux',
          browser: 'Firefox',
          expiresIn: '1h',
          shouldBeWhiteListed: true,
        },
        {
          userAgent:
            'Mozilla/5.0 (X11; Linux x86_64; rv:100.0) ' +
            'Gecko/20100101 Firefox/100.0',
          os: 'Linux',
          browser: 'Firefox',
          expiresIn: '10',
          shouldBeWhiteListed: false,
        },
        {
          userAgent:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/100.0.4896.162 Safari/537.36',
          os: 'Linux',
          browser: 'Chrome',
          expiresIn: '1h',
          shouldBeWhiteListed: true,
        },
        {
          userAgent:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/100.0.4896.162 Safari/537.36',
          os: 'Linux',
          browser: 'Chrome',
          expiresIn: '10',
          shouldBeWhiteListed: false,
        },
      ];
      const profile = {
        name: 'NataliaRosa',
        email: 'natalia.teresinha.darosa@sofisticattomoveis.com.br',
        password: 'cg1OnIkdN4',
      };
      const signUpResponse = await request(app)
        .post('/signup')
        .send(profile)
        .set(
          'User-Agent',
          'Mozilla/5.0 (Linux; Android 6.0.1; SM-J700M) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36'
        );
      const { id: profileId } =
        await localProfileRepository.getLocalProfileByName(profile.name);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        signUpResponse.body.refresh_token
      );
      for (const [i, test] of tests.entries()) {
        tests[i].refreshToken = await createRefreshToken(
          profileId,
          test.userAgent,
          { expiresIn: test.expiresIn }
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 20));

      const response = await request(app)
        .get('/devices')
        .set('Authorization', `Bearer ${signUpResponse.body.access_token}`);
      for (const [i, test] of tests.entries()) {
        tests[i].isRefreshTokenWhitelisted =
          await localAuthUtils.isRefreshTokenInStorage(
            profileId,
            test.refreshToken
          );
      }

      await localProfileRepository.deleteLocalProfile(profileId);
      for (const test of tests) {
        await localAuthUtils.removeRefreshTokenFromStorage(
          profileId,
          test.refreshToken
        );
      }
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(
        tests.filter((test) => test.shouldBeWhiteListed).length
      );
      for (const [i] of response.body.entries()) {
        expect(response.body[i]).toHaveProperty('id');
        expect(response.body[i]).toHaveProperty('os');
        expect(response.body[i]).toHaveProperty('browser');
      }
      for (const test of tests) {
        expect(test.isRefreshTokenWhitelisted).toBe(test.shouldBeWhiteListed);
      }
    }
  );
});
