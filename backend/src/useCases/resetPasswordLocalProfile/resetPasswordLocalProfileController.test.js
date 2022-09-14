const request = require('supertest');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

const createForgotPasswordToken = async (
  profileId,
  profileName,
  options = {}
) => {
  const {
    secret = process.env.FORGOT_PASSWORD_TOKEN_SECRET,
    expiresIn = process.env.FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME,
  } = options;
  const payload = {
    iss: process.env.APP_URL,
    sub: profileId,
    name: profileName,
    jti: randomUUID(),
  };
  const forgotPasswordToken = jwt.sign(payload, secret, {
    expiresIn,
  });
  await localAuthUtils.storeForgotPasswordToken(profileId, forgotPasswordToken);
  return forgotPasswordToken;
};

afterAll(async () => {
  Queue.close();
  await redisClient.delKeys('bull:*');
  await redisClient.quit();
  await knex.destroy();
});

describe('resetPasswordLocalProfileController', () => {
  it('Should be able to update the profile password', async () => {
    const profile = {
      name: 'MirellaRodrigues',
      email: 'mirella_lorena_rodrigues@policiapenal.com',
      password: '6jtlpt9lW5',
    };
    const newPassword = 'PLDcsKJK7o';
    const signUpResponse = await request(app).post('/signup').send(profile);
    const initialProfileData =
      await localProfileRepository.getLocalProfileByEmail(profile.email);
    const forgotPasswordToken = await createForgotPasswordToken(
      initialProfileData.id,
      initialProfileData.name
    );

    const response = await request(app).patch('/resetpassword').send({
      email: profile.email,
      forgot_password_token: forgotPasswordToken,
      new_password: newPassword,
    });

    const updatedProfileData =
      await localProfileRepository.getLocalProfileByEmail(profile.email);
    await localProfileRepository.deleteLocalProfile(initialProfileData.id);
    await localAuthUtils.removeRefreshTokenFromStorage(
      initialProfileData.id,
      signUpResponse.body.refresh_token
    );
    await localAuthUtils.removeForgotPasswordTokenFromStorage(
      initialProfileData.id,
      forgotPasswordToken
    );
    expect(response.status).toBe(200);
    expect(
      localAuthUtils.comparePassword(
        profile.password,
        initialProfileData.password
      )
    ).toBeTruthy();
    expect(
      localAuthUtils.comparePassword(newPassword, updatedProfileData.password)
    ).toBeTruthy();
  });

  it(
    'Should not update profile password if the data in request body is ' +
      'not correct',
    async () => {
      const profile = {
        name: 'FabianaGiovanna',
        email: 'fabianagiovannadaconceicao@hotelruby.com.br',
        password: 'yKIKgolHf8',
      };
      const signUpResponse = await request(app).post('/signup').send(profile);
      profile.id = (
        await localProfileRepository.getLocalProfileByEmail(profile.email)
      ).id;
      const forgotPasswordToken = await createForgotPasswordToken(
        profile.id,
        profile.name.toLowerCase()
      );
      const tests = [
        {
          data: {
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" is required',
        },
        {
          data: {
            email: '',
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" is not allowed to be empty',
        },
        {
          data: {
            email: 123,
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" must be a string',
        },
        {
          data: {
            email: true,
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" must be a string',
        },
        {
          data: {
            email: false,
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" must be a string',
        },
        {
          data: {
            email: null,
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" must be a string',
        },
        {
          data: {
            email: undefined,
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" is required',
        },
        {
          data: {
            email: {},
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" must be a string',
        },
        {
          data: {
            email: [],
            forgot_password_token: forgotPasswordToken,
            new_password: profile.password,
          },
          message: '"email" must be a string',
        },
        {
          data: { email: profile.email, new_password: profile.password },
          message: '"forgot_password_token" is required',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: '',
            new_password: profile.password,
          },
          message: '"forgot_password_token" is not allowed to be empty',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: 23467,
            new_password: profile.password,
          },
          message: '"forgot_password_token" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: true,
            new_password: profile.password,
          },
          message: '"forgot_password_token" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: false,
            new_password: profile.password,
          },
          message: '"forgot_password_token" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: null,
            new_password: profile.password,
          },
          message: '"forgot_password_token" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: undefined,
            new_password: profile.password,
          },
          message: '"forgot_password_token" is required',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: {},
            new_password: profile.password,
          },
          message: '"forgot_password_token" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: [],
            new_password: profile.password,
          },
          message: '"forgot_password_token" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
          },
          message: '"new_password" is required',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: '',
          },
          message: '"new_password" is not allowed to be empty',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: 4562,
          },
          message: '"new_password" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: true,
          },
          message: '"new_password" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: false,
          },
          message: '"new_password" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: null,
          },
          message: '"new_password" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: undefined,
          },
          message: '"new_password" is required',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: {},
          },
          message: '"new_password" must be a string',
        },
        {
          data: {
            email: profile.email,
            forgot_password_token: forgotPasswordToken,
            new_password: [],
          },
          message: '"new_password" must be a string',
        },
      ];

      for (const [i, test] of tests.entries()) {
        tests[i].response = await request(app)
          .patch('/resetpassword')
          .send(test.data);
      }

      await localProfileRepository.deleteLocalProfile(profile.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profile.id,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeForgotPasswordTokenFromStorage(
        profile.id,
        forgotPasswordToken
      );
      for (const test of tests) {
        expect(test.response.status).toBe(400);
        expect(test.response.body.message).toBe(test.message);
      }
    }
  );

  it(
    'Should not update the profile password if there is no profile registered ' +
      'with the email provided',
    async () => {
      const profiles = [
        {
          name: 'Geraldo_Dias',
          email: 'geraldo.danilo.dias@fernandaleal.com.br',
          password: 'KfmadSoupJ',
        },
        {
          name: 'NairViana',
          email: 'nair-viana90@tanby.com.br',
          password: 'fFgr13X74x',
        },
      ];
      const signUpResponse = await request(app)
        .post('/signup')
        .send(profiles[0]);
      const registeredProfile =
        await localProfileRepository.getLocalProfileByEmail(profiles[0].email);
      const forgotPasswordToken = await createForgotPasswordToken(
        registeredProfile.id,
        registeredProfile.name
      );

      const response = await request(app).patch('/resetpassword').send({
        email: profiles[1].email,
        forgot_password_token: forgotPasswordToken,
        new_password: profiles[1].password,
      });

      const updatedRegisteredProfile =
        await localProfileRepository.getLocalProfileByEmail(profiles[0].email);
      await localProfileRepository.deleteLocalProfile(registeredProfile.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        registeredProfile.id,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeForgotPasswordTokenFromStorage(
        registeredProfile.id,
        forgotPasswordToken
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('profile not found');
      expect(registeredProfile.password).toEqual(
        updatedRegisteredProfile.password
      );
      expect(
        localAuthUtils.comparePassword(
          profiles[0].password,
          updatedRegisteredProfile.password
        )
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(
          profiles[1].password,
          updatedRegisteredProfile.password
        )
      ).toBeFalsy();
    }
  );

  it(
    'Should not update profile password if "forgotPasswordToken" ' +
      'is not whitelisted',
    async () => {
      const profile = {
        name: 'AndreiaFernandes',
        email: 'andreia.isis.fernandes@purkyt.com',
        password: 'PknDKuHIGi',
      };
      const newPassword = 'SofYaRk4bm';
      const signUpResponse = await request(app).post('/signup').send(profile);
      const profileData = await localProfileRepository.getLocalProfileByEmail(
        profile.email
      );
      const forgotPasswordToken = await createForgotPasswordToken(
        profileData.id,
        profileData.name
      );
      localAuthUtils.removeForgotPasswordTokenFromStorage(
        profileData.id,
        forgotPasswordToken
      );

      const response = await request(app).patch('/resetpassword').send({
        email: profile.email,
        forgot_password_token: forgotPasswordToken,
        new_password: newPassword,
      });

      const updatedProfileData =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localProfileRepository.deleteLocalProfile(profileData.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileData.id,
        signUpResponse.body.refresh_token
      );
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('invalid "forgot_password_token"');
      expect(profileData.password).toEqual(updatedProfileData.password);
      expect(
        localAuthUtils.comparePassword(
          profile.password,
          updatedProfileData.password
        )
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(newPassword, updatedProfileData.password)
      ).toBeFalsy();
    }
  );

  it(
    'Should not update profile password if "forgotPasswordToken" ' +
      'is expired',
    async () => {
      const profile = {
        name: 'Felipe_Santos',
        email: 'felipe.manoel.santos@gruposimoes.com.br',
        password: 'C71cFwON2u',
      };
      const newPassword = 'zc0Hq7zyp1';
      const signUpResponse = await request(app).post('/signup').send(profile);
      const profileData = await localProfileRepository.getLocalProfileByEmail(
        profile.email
      );
      const forgotPasswordToken = await createForgotPasswordToken(
        profileData.id,
        profileData.name,
        { expiresIn: '10' }
      );
      await new Promise((resolve) => setTimeout(resolve, 20));

      const response = await request(app).patch('/resetpassword').send({
        email: profile.email,
        forgot_password_token: forgotPasswordToken,
        new_password: newPassword,
      });

      const updatedProfileData =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localProfileRepository.deleteLocalProfile(profileData.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileData.id,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeForgotPasswordTokenFromStorage(
        profileData.id,
        forgotPasswordToken
      );
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('invalid "forgot_password_token"');
      expect(profileData.password).toEqual(updatedProfileData.password);
      expect(
        localAuthUtils.comparePassword(
          profile.password,
          updatedProfileData.password
        )
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(newPassword, updatedProfileData.password)
      ).toBeFalsy();
    }
  );

  it(
    'Should not update profile password if "forgotPasswordToken" ' +
      'does not have a valid signature',
    async () => {
      const profile = {
        name: 'Mariah_Ribeiro',
        email: 'mariah_ribeiro@eletrovip.com',
        password: 'Qq0Ye6aWi8',
      };
      const newPassword = 'gBxZFLULKz';
      const signUpResponse = await request(app).post('/signup').send(profile);
      const profileData = await localProfileRepository.getLocalProfileByEmail(
        profile.email
      );
      const forgotPasswordToken = await createForgotPasswordToken(
        profileData.id,
        profileData.name,
        {
          secret:
            '80ed5dee82c93fe7afdb09e9c472bb3fb736daca1d88c1deea9b6a5737772574',
        }
      );

      const response = await request(app).patch('/resetpassword').send({
        email: profile.email,
        forgot_password_token: forgotPasswordToken,
        new_password: newPassword,
      });

      const updatedProfileData =
        await localProfileRepository.getLocalProfileByEmail(profile.email);
      await localProfileRepository.deleteLocalProfile(profileData.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profileData.id,
        signUpResponse.body.refresh_token
      );
      await localAuthUtils.removeForgotPasswordTokenFromStorage(
        profileData.id,
        forgotPasswordToken
      );
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('invalid "forgot_password_token"');
      expect(profileData.password).toEqual(updatedProfileData.password);
      expect(
        localAuthUtils.comparePassword(
          profile.password,
          updatedProfileData.password
        )
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(newPassword, updatedProfileData.password)
      ).toBeFalsy();
    }
  );

  it(
    'Should not update the profile password if the "forgotPasswordToken" ' +
      'does not belong to the profile of the email provided',
    async () => {
      const profiles = [
        {
          name: 'CarolinaSilva',
          email: 'carolina.marlene.dasilva@heineken.com.br',
          password: 'yOwb8RGUbH',
        },
        {
          name: 'Sophie_Mata',
          email: 'sophiejuliadamata@signa.net.br',
          password: 'sj53DarXbe',
        },
      ];
      const newPassword = 'xqMlrTNwAW';
      const signUpResponses = [];
      signUpResponses[0] = await request(app).post('/signup').send(profiles[0]);
      signUpResponses[1] = await request(app).post('/signup').send(profiles[1]);
      profiles[0].data = await localProfileRepository.getLocalProfileByEmail(
        profiles[0].email
      );
      profiles[1].data = await localProfileRepository.getLocalProfileByEmail(
        profiles[1].email
      );
      const forgotPasswordToken = await createForgotPasswordToken(
        profiles[1].data.id,
        profiles[1].data.name
      );

      const response = await request(app).patch('/resetpassword').send({
        email: profiles[0].email,
        forgot_password_token: forgotPasswordToken,
        new_password: newPassword,
      });

      profiles[0].updatedData =
        await localProfileRepository.getLocalProfileByEmail(profiles[0].email);
      profiles[1].updatedData =
        await localProfileRepository.getLocalProfileByEmail(profiles[1].email);
      await localProfileRepository.deleteLocalProfile(profiles[0].data.id);
      await localProfileRepository.deleteLocalProfile(profiles[1].data.id);
      await localAuthUtils.removeRefreshTokenFromStorage(
        profiles[0].data.id,
        signUpResponses[0].body.refresh_token
      );
      await localAuthUtils.removeRefreshTokenFromStorage(
        profiles[1].data.id,
        signUpResponses[1].body.refresh_token
      );
      await localAuthUtils.removeForgotPasswordTokenFromStorage(
        profiles[1].data.id,
        forgotPasswordToken
      );
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('invalid "email"');
      expect(profiles[0].data.password).toEqual(
        profiles[0].updatedData.password
      );
      expect(profiles[1].data.password).toEqual(
        profiles[1].updatedData.password
      );
      expect(
        localAuthUtils.comparePassword(
          profiles[0].password,
          profiles[0].updatedData.password
        )
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(
          profiles[1].password,
          profiles[1].updatedData.password
        )
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(
          newPassword,
          profiles[0].updatedData.password
        )
      ).toBeFalsy();
      expect(
        localAuthUtils.comparePassword(
          newPassword,
          profiles[1].updatedData.password
        )
      ).toBeFalsy();
    }
  );
});
