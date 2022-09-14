const authorization = require('./authorizationMiddleware');
const redisClient = require('../lib/redisClient');
const localAuthUtils = require('../utils/localAuth');

class Response {
  constructor() {
    this.statusCode;
    this.body = {};
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(body) {
    this.body = JSON.parse(JSON.stringify(body));
    return this;
  }
}
const next = jest.fn();

afterAll(async () => {
  await redisClient.quit();
});

describe('authorizationMiddleware', () => {
  beforeEach(() => {
    next.mockReset();
  });

  it(
    'Should call the "next" function once and add the "profileId" parameter ' +
      'to the "req" when receiving a valid authorization header in the request',
    () => {
      for (_ of [...Array(10).keys()]) {
        next.mockReset();
        const profileId = Math.floor(Math.random() * 999999);
        const req = {
          headers: {
            authorization: `Bearer ${localAuthUtils.generateAccessToken(
              profileId,
              `profile${profileId}`
            )}`,
          },
        };
        const res = new Response();

        authorization(req, res, next);

        expect(req.profileId).toBe(profileId);
        expect(next.mock.calls.length).toBe(1);
        expect(res.statusCode).toBeUndefined();
        expect(JSON.stringify(res.body)).toBe('{}');
      }
    }
  );

  it('Should return status 401 and an error message when no "access_token" is provided', () => {
    const tests = [
      {
        req: { headers: { authorization: undefined } },
        req: { headers: { authorization: '' } },
      },
    ];
    for (const test of tests) {
      next.mockReset();
      const req = test.req;
      const res = new Response();

      authorization(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('no "access_token" provided');
      expect(next.mock.calls.length).toBe(0);
    }
  });

  it(
    'should return status 401 and an error message when receiving an ' +
      '"access_token" with incorrect number of parts',
    () => {
      const tests = [
        {
          req: {
            headers: {
              authorization:
                'Bearer askldfjalksdf askldfjafdf zsdfadf asdfasdf adsfaf',
            },
          },
        },
        {
          req: {
            headers: {
              authorization: 'Bearer askldfjalksdf askldfjaa asdfas asdfaf',
            },
          },
        },
        {
          req: {
            headers: {
              authorization: 'Bearer askldfjalksdf askldfja sadfasad',
            },
          },
        },
        {
          req: {
            headers: { authorization: 'Bearer askldfjalksdf askldfjafasd' },
          },
        },
        { req: { headers: { authorization: 'askldfjalksdfaskldfja' } } },
        { req: { headers: { authorization: 'Bearer' } } },
      ];
      for (const test of tests) {
        next.mockReset();
        const req = test.req;
        const res = new Response();

        authorization(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('"access_token" error');
        expect(next.mock.calls.length).toBe(0);
      }
    }
  );

  it(
    'should return status 401 and an error message when receiving an ' +
      'malformed "access_token"',
    () => {
      const tests = [
        { req: { headers: { authorization: 'adfasdf asdfkjaskdjfa' } } },
        { req: { headers: { authorization: 'asdfadf asdjfasdjfkas' } } },
        { req: { headers: { authorization: 'sdfgafg aksdfjaksdjfd' } } },
        { req: { headers: { authorization: 'dfhsdfg jkklajskdfaad' } } },
        { req: { headers: { authorization: 'sdasdfd askdjfaklsdas' } } },
        { req: { headers: { authorization: 'adfdfdf lkjasdfkjakjb' } } },
      ];
      for (const test of tests) {
        next.mockReset();
        const req = test.req;
        const res = new Response();

        authorization(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('"access_token" malformed');
        expect(next.mock.calls.length).toBe(0);
      }
    }
  );

  it(
    'should return status 401 and an error message when receiving an ' +
      'invalid "access_token"',
    () => {
      const tests = [
        { req: { headers: { authorization: 'Bearer ' } } },
        {
          req: {
            headers: {
              authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSw' +
                'iaWF0IjoxNjUwMzk2ODQ4LCJleHAiOjE2NTA0ODMyNDh9.eH' +
                'csE7Xm9S8m83mmLkM0EWAKoMU_w_w1yUehKAx6hPc',
            },
          },
        },
        {
          req: {
            headers: {
              authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZ' +
                'CI6MiwiaWF0IjoxNjUwNTkyOTQyLCJleHAiOjE2NTA2NzkzNDJ9.jXO' +
                'z-KEXKSFA_cvoNMUO5yyVQgB9V5krMtEjn9rhn7Q',
            },
          },
        },
        {
          req: {
            headers: {
              authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MS' +
                'wiaWF0IjoxNjUwNTkyOTQyLCJleHAiOjE2NTA2NzkzNDJ9.AZyb3Ps1' +
                'U7g_BARNvonZ7fS0H-QPKzOTZXmKG-fJFSU',
            },
          },
        },
        {
          req: {
            headers: {
              authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF' +
                '0IjoxNjUwNTkyOTQyfQ.G3RZV0jRimsy9Hx_xijgXZvhc0KzdrsurvLL57oPZs8',
            },
          },
        },
        {
          req: {
            headers: {
              authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0Ij' +
                'oxNjUwNTkyOTQyfQ.6zUFLTYOOgE1UEjc35J-SNz3Rn--cT_KRLDai9RFUMU',
            },
          },
        },
      ];
      for (const test of tests) {
        next.mockReset();
        const req = test.req;
        const res = new Response();

        authorization(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('invalid "access_token"');
        expect(next.mock.calls.length).toBe(0);
      }
    }
  );
});
