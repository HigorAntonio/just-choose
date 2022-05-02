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
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
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
    const tests = [
      { email: 'enricojuanjesus@solutionimoveis.com.br', status: 400 },
      { email: 'caua_tiago_viana@jpmanager.com.br', status: 400 },
      { email: 'evelyn_antonella_aparicio@acritica.com.br', status: 400 },
      { email: 'elias_joao_baptista@moncoes.com.br', status: 400 },
      { email: 'giovanni.ryan.nascimento@gdsambiental.com.br', status: 400 },
      { email: 'fernando.caue.ramos@focusdm.com.br', status: 400 },
      { email: 'bruna.bianca.moreira@dye.com.br', status: 400 },
      { email: 'thales_osvaldo_araujo@statusseguros.com.br', status: 400 },
      { email: 'nicolas_caio_freitas@hotmailo.com', status: 400 },
      { email: 'franciscoerickdarocha@outlook.com', status: 200 },
    ];
    const profile = {
      name: 'Francisco_da_Rocha',
      email: tests[tests.length - 1].email,
      password: 'bDKSN9oMm8',
    };
    const signUpResponse = await request(app).post('/signup').send(profile);

    for (const [i, test] of tests.entries()) {
      tests[i].response = await request(app).post('/signin').send({
        email: test.email,
        password: profile.password,
      });
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
      tests[tests.length - 1].response.body.refresh_token
    );
    for (const test of tests) {
      expect(test.response.status).toBe(test.status);
      if (test.status === 200) {
        expect(test.response.body).toHaveProperty('access_token');
        expect(test.response.body).toHaveProperty('refresh_token');
      }
      if (test.status === 400) {
        expect(test.response.body.message).toBe('profile does not exist');
      }
    }
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
    const signUpResponse = await request(app).post('/signup').send(profile);

    for (const [i, test] of tests.entries()) {
      tests[i].response = await request(app).post('/signin').send(test.profile);
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
      tests[tests.length - 1].response.body.refresh_token
    );
    for (const test of tests) {
      expect(test.response.status).toBe(test.status);
      if (test.status === 400) {
        expect(test.response.body.message).toBe(test.message);
      }
      if (test.status === 200) {
        expect(test.response.body).toHaveProperty('access_token');
        expect(test.response.body).toHaveProperty('refresh_token');
      }
    }
  });

  it('Should not be able to sign in with wrong password', async () => {
    const tests = [
      { password: 'RNEaxLG2WZ', status: 400 },
      { password: 'xATjJzIecj', status: 400 },
      { password: 'nsItdyADmt', status: 400 },
      { password: 'INmPXe1TWf', status: 400 },
      { password: 'KsWnceXiG7', status: 400 },
      { password: 'BBX0IUAPpb', status: 400 },
      { password: 'QOPn4GWkNu', status: 400 },
      { password: 'aquurS9zNy', status: 400 },
      { password: 'p474Up1EYm', status: 400 },
      { password: '2KW4B6msms', status: 200 },
    ];
    const profile = {
      name: 'Andrea_Pires',
      email: 'andrea.ayla.pires@fernandesfilpi.com.br',
      password: tests[tests.length - 1].password,
    };
    const signUpResponse = await request(app).post('/signup').send(profile);

    for (const [i, test] of tests.entries()) {
      tests[i].response = await request(app).post('/signin').send({
        email: profile.email,
        password: test.password,
      });
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
      tests[tests.length - 1].response.body.refresh_token
    );
    for (const test of tests) {
      expect(test.response.status).toBe(test.status);
      if (test.status === 200) {
        expect(test.response.body).toHaveProperty('access_token');
        expect(test.response.body).toHaveProperty('refresh_token');
      }
      if (test.status === 400) {
        expect(test.response.body.message).toBe('incorrect password');
      }
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
    const signUpResponse = await request(app).post('/signup').send(profile);

    for (const [i, test] of tests.entries()) {
      tests[i].response = await request(app).post('/signin').send(test.profile);
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
      tests[tests.length - 1].response.body.refresh_token
    );
    for (const test of tests) {
      expect(test.response.status).toBe(test.status);
      if (test.status === 400) {
        expect(test.response.body.message).toBe(test.message);
      }
      if (test.status === 200) {
        expect(test.response.body).toHaveProperty('access_token');
        expect(test.response.body).toHaveProperty('refresh_token');
      }
    }
  });
});
