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

describe('forgotPasswordLocalProfileController', () => {
  it(
    'Should send an email containing instructions for resetting the profile ' +
      'password when the email informed belongs ' +
      'to a profile registered in the system',
    async () => {
      const tests = [
        {
          profile: {
            name: 'LuanCavalcanti',
            email: 'luan_cavalcanti@rafaeladson.com',
            password: 'TlnkWUFND7',
          },
        },
        {
          profile: {
            name: 'Hugo_Pereira',
            email: 'hugoenzopereira@riscao.com.br',
            password: 'B5qi73aFTU',
          },
        },
        {
          profile: {
            name: 'AuroraSilveira',
            email: 'aurora_tatiane_silveira@hlt.arq.br',
            password: 'kzg4B4ja4F',
          },
        },
        {
          profile: {
            name: 'Amanda_Moraes',
            email: 'amandamarcelamoraes@clinicasilhouette.com.br',
            password: '3aloKnczQp',
          },
        },
        {
          profile: {
            name: 'CristianeJesus',
            email: 'cristiane.daniela.jesus@pig.com.br',
            password: 'a2DeOu9asL',
          },
        },
      ];

      for (const [i, test] of tests.entries()) {
        await request(app).post('/signup').send(test.profile);
        tests[i].profileId = (
          await localProfileRepository.getLocalProfileByEmail(
            test.profile.email
          )
        ).id;
      }
      for (const test of tests) {
        const response = await request(app)
          .post('/forgotpassword')
          .send({ email: test.profile.email });

        expect(response.status).toBe(200);
      }
      for (const test of tests) {
        await localProfileRepository.deleteLocalProfile(test.profileId);
      }
      await redisClient.flushdbAsync();
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
