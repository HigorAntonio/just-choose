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

describe('signInLocalProfileController', () => {
  it('Should be able to sign in with an existing profile', async () => {
    const profile = {
      name: 'VitorFogaca',
      email: 'vitorluizfogaca@tricoproducts.com.br',
      password: 'kSpXbHA1DO',
    };

    const signUpResponse = await request(app).post('/signup').send(profile);
    const response = await request(app).post('/signin').send({
      email: profile.email,
      password: profile.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      response.body.refresh_token
    );
  });

  it('Should not be able to sign in with a non-existent profile', async () => {
    const profile = {
      email: 'henry.murilo.duarte@fosjc.unesp.br',
      password: 'GhQpt7LgP7',
    };

    const response = await request(app).post('/signin').send({
      email: profile.email,
      password: profile.password,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('profile does not exist');
  });

  it('Should not be able to sign in with wrong email', async () => {
    const emails = [
      'enricojuanjesus@solutionimoveis.com.br',
      'caua_tiago_viana@jpmanager.com.br',
      'evelyn_antonella_aparicio@acritica.com.br',
      'elias_joao_baptista@moncoes.com.br',
      'giovanni.ryan.nascimento@gdsambiental.com.br',
      'fernando.caue.ramos@focusdm.com.br',
      'bruna.bianca.moreira@dye.com.br',
      'thales_osvaldo_araujo@statusseguros.com.br',
      'nicolas_caio_freitas@hotmailo.com',
      'franciscoerickdarocha@outlook.com',
    ];

    const profile = {
      name: 'Francisco_da_Rocha',
      email: emails[emails.length - 1],
      password: 'bDKSN9oMm8',
    };

    const signInResponse = await request(app).post('/signup').send(profile);
    let signUpResponse;
    for (const [i, email] of emails.entries()) {
      const response = await request(app).post('/signin').send({
        email,
        password: profile.password,
      });

      if (i === emails.length - 1) {
        signUpResponse = response;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
      } else {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('profile does not exist');
      }
    }
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signUpResponse.body.refresh_token
    );
    await localAuthUtils.removeRefreshTokenFromStorage(
      profileId,
      signInResponse.body.refresh_token
    );
  });

  it('Should not be able to sign in with invalid email', async () => {
    const tests = [
      {
        profile: {
          email: '',
          password: 'YhF73aIRj0',
        },
        status: 400,
        message: '"email" is not allowed to be empty',
      },
      {
        profile: {
          email: 2526,
          password: 'YhF73aIRj0',
        },
        status: 400,
        message: '"email" must be a string',
      },
      {
        profile: {
          email: true,
          password: 'YhF73aIRj0',
        },
        status: 400,
        message: '"email" must be a string',
      },
      {
        profile: {
          email: false,
          password: 'YhF73aIRj0',
        },
        status: 400,
        message: '"email" must be a string',
      },
      {
        profile: {
          email: 'mirelladeboracardos',
          password: 'YhF73aIRj0',
        },
        status: 400,
        message: '"email" must be a valid email',
      },
      {
        profile: {
          password: 'YhF73aIRj0',
        },
        status: 400,
        message: '"email" is required',
      },
      {
        profile: {
          name: 'MirellaCardoso',
          email: 'mirelladeboracardoso@comprehense.com.br',
          password: 'YhF73aIRj0',
        },
        status: 200,
      },
    ];
    const { profile } = tests[tests.length - 1];

    const refreshTokens = [];
    const signUpResponse = await request(app).post('/signup').send(profile);
    refreshTokens.push(signUpResponse.body.refresh_token);
    for (const test of tests) {
      const response = await request(app).post('/signin').send(test.profile);

      expect(response.status).toBe(test.status);
      if (test.status === 400) {
        expect(response.body.message).toBe(test.message);
      }
      if (test.status === 200) {
        refreshTokens.push(response.body.refresh_token);
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
      }
    }
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);
    for (const refreshToken of refreshTokens) {
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        refreshToken
      );
    }
  });

  it('Should not be able to sign in with wrong password', async () => {
    const passwords = [
      'RNEaxLG2WZ',
      'xATjJzIecj',
      'nsItdyADmt',
      'INmPXe1TWf',
      'KsWnceXiG7',
      'BBX0IUAPpb',
      'QOPn4GWkNu',
      'aquurS9zNy',
      'p474Up1EYm',
      '2KW4B6msms',
    ];
    const profile = {
      name: 'Andrea_Pires',
      email: 'andrea.ayla.pires@fernandesfilpi.com.br',
      password: passwords[passwords.length - 1],
    };
    const refreshTokens = [];
    const signUpResponse = await request(app).post('/signup').send(profile);
    refreshTokens.push(signUpResponse.body.refresh_token);
    for (const [i, password] of passwords.entries()) {
      const response = await request(app).post('/signin').send({
        email: profile.email,
        password,
      });

      if (i === passwords.length - 1) {
        refreshTokens.push(response.body.refresh_token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
      } else {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('incorrect password');
      }
    }
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);
    for (const refreshToken of refreshTokens) {
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        refreshToken
      );
    }
  });

  it('Should not be able to sign in with invalid password', async () => {
    const tests = [
      {
        profile: {
          email: 'thales_kevin_sales@carreiradasilva.com',
          password: '',
        },
        status: 400,
        message: '"password" is not allowed to be empty',
      },
      {
        profile: {
          email: 'thales_kevin_sales@carreiradasilva.com',
          password: 8990,
        },
        status: 400,
        message: '"password" must be a string',
      },
      {
        profile: {
          email: 'thales_kevin_sales@carreiradasilva.com',
          password: true,
        },
        status: 400,
        message: '"password" must be a string',
      },
      {
        profile: {
          email: 'thales_kevin_sales@carreiradasilva.com',
          password: false,
        },
        status: 400,
        message: '"password" must be a string',
      },
      {
        profile: {
          email: 'thales_kevin_sales@carreiradasilva.com',
        },
        status: 400,
        message: '"password" is required',
      },
      {
        profile: {
          name: 'ThalesKevin',
          email: 'thales_kevin_sales@carreiradasilva.com',
          password: 'zAHoGo8rIR',
        },
        status: 200,
      },
    ];
    const { profile } = tests[tests.length - 1];
    const refreshTokens = [];
    const signUpResponse = await request(app).post('/signup').send(profile);
    refreshTokens.push(signUpResponse.body.refresh_token);
    for (const test of tests) {
      const response = await request(app).post('/signin').send(test.profile);

      expect(response.status).toBe(test.status);
      if (test.status === 400) {
        expect(response.body.message).toBe(test.message);
      }
      if (test.status === 200) {
        refreshTokens.push(response.body.refresh_token);
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
      }
    }
    const { id: profileId } =
      await localProfileRepository.getLocalProfileByName(profile.name);
    await localProfileRepository.deleteLocalProfile(profileId);
    for (const refreshToken of refreshTokens) {
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileId,
        refreshToken
      );
    }
  });
});
