const request = require('supertest');
const Queue = require('../../lib/Queue');
const redisClient = require('../../lib/redisClient');
const knex = require('../../database');
const app = require('../../app');
const localProfileRepository = require('../../repositories/localProfileRepository');
const localAuthUtils = require('../../utils/localAuth');

const createForgotPasswordToken = async (profileId) => {
  const forgotPasswordToken = localAuthUtils.generateForgotPasswordToken({
    id: profileId,
  });
  await redisClient.saddAsync('forgotPasswordTokens', forgotPasswordToken);
  return forgotPasswordToken;
};

afterAll(async () => {
  Queue.close();
  await redisClient.quitAsync();
  await knex.destroy();
});

describe('resetPasswordLocalProfileController', () => {
  it('Should be able to update the profile password', async () => {
    const tests = [
      {
        profile: {
          name: 'MirellaRodrigues',
          email: 'mirella_lorena_rodrigues@policiapenal.com',
          password: '6jtlpt9lW5',
        },
        newPassword: 'PLDcsKJK7o',
      },
      {
        profile: {
          name: 'Anderson_Cruz',
          email: 'anderson_nicolas_dacruz@agenciaph.com',
          password: 'DyF4HW7Up9',
        },
        newPassword: '5TzQHexEWQ',
      },
      {
        profile: {
          name: 'SebastiaoCastro',
          email: 'sebastiaoluiscastro@construtorastaizabel.com.br',
          password: 'ELZIDhOwJd',
        },
        newPassword: '7E1zCxyfh2',
      },
      {
        profile: {
          name: 'Lucca_Jesus',
          email: 'lucca_jesus@julianacaran.com.br',
          password: 'nXsaWzqS2o',
        },
        newPassword: '1xRtxBb0h8',
      },
      {
        profile: {
          name: 'MarcosNascimento',
          email: 'marcos.eduardo.nascimento@officetectecnologia.com.br',
          password: 'YZpfbcKcJi',
        },
        newPassword: 'Ru5eXHpX6N',
      },
      {
        profile: {
          name: 'Sara_Ribeiro',
          email: 'sara.giovana.ribeiro@doublesp.com.br',
          password: 'sZ3maEAbNy',
        },
        newPassword: 'JWUaf0FxAH',
      },
      {
        profile: {
          name: 'FranciscaNascimento',
          email: 'francisca_evelyn_nascimento@danzarin.com.br',
          password: '7Yzfl2pidS',
        },
        newPassword: 'RBwe6LBQHY',
      },
    ];
    for (const [i, test] of tests.entries()) {
      await request(app).post('/signup').send(test.profile);
      const profile = await localProfileRepository.getLocalProfileByEmail(
        test.profile.email
      );
      tests[i].profileId = profile.id;
      const forgotPasswordToken = await createForgotPasswordToken(profile.id);

      const response = await request(app).patch('/resetpassword').send({
        email: test.profile.email,
        forgot_password_token: forgotPasswordToken,
        new_password: test.newPassword,
      });
      const updatedProfile =
        await localProfileRepository.getLocalProfileByEmail(test.profile.email);

      expect(response.status).toBe(200);
      expect(
        localAuthUtils.comparePassword(test.profile.password, profile.password)
      ).toBeTruthy();
      expect(
        localAuthUtils.comparePassword(
          test.newPassword,
          updatedProfile.password
        )
      ).toBeTruthy();
    }
    for (const test of tests) {
      await localProfileRepository.deleteLocalProfile(test.profileId);
    }
    await redisClient.flushdbAsync();
  });

  it(
    'Should not update profile password if the data in request body is ' +
      'not correct',
    async () => {}
  );

  it(
    'Should not update the profile password if there is no profile registered ' +
      'with the email provided',
    async () => {}
  );

  it(
    'Should not update profile password if "forgetPasswordToken" ' +
      'is not whitelisted',
    async () => {}
  );

  it(
    'Should not update profile password if "forgetPasswordToken" ' +
      'is expired',
    async () => {}
  );

  it(
    'Should not update profile password if "forgetPasswordToken" ' +
      'does not have a valid signature',
    async () => {}
  );

  it(
    'Should not update the profile password if the "forgot Password Token" ' +
      'does not belong to the profile of the email provided',
    async () => {}
  );
});
