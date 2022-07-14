import supertest from 'supertest';

import authRouter from 'routers/auth_router';
import { userService } from 'services';
import { mockUser, connectDB, dropDB } from '../../../__jest__/helpers';

const request = supertest(authRouter);

// Mocks requireAuth server middleware
jest.mock('../../authentication/requireAuth');

describe('Working auth router', () => {
  beforeAll(async (done) => {
    try {
      connectDB(done);
    } catch (error) {
      done(error);
    }
  });

  afterAll(async (done) => {
    try {
      dropDB(done);
    } catch (error) {
      done(error);
    }
  });

  describe('POST /signup', () => {
    it('blocks creation when missing field', async (done) => {
      try {
        const createSpy = jest.spyOn(userService, 'createUser');

        const attempts = Object.keys(mockUser).map(async (key) => {
          const user = { ...mockUser };
          delete user[key];

          const res = await request
            .post('/signup')
            .send(user);

          expect(res.status).toBe(400);
          expect(res.body.errors.length).toBe(1);
          expect(createSpy).not.toHaveBeenCalled();
        });
        await Promise.all(attempts);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('blocks creation when field invalid', async (done) => {
      try {
        const createSpy = jest.spyOn(userService, 'createUser');

        const attempts = Object.keys(mockUser).map(async (key) => {
          const User = { ...mockUser };
          User[key] = typeof User[key] === 'number'
            ? 'some string'
            : 0;

          const res = await request
            .post('/signup')
            .send(User);

          expect(res.status).toBe(400);
          expect(res.body.errors.length).toBe(1);
          expect(createSpy).not.toHaveBeenCalled();
        });
        await Promise.all(attempts);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('creates user when body is valid', async (done) => {
      try {
        const createSpy = jest.spyOn(userService, 'createUser');

        const res = await request
          .post('/signup')
          .send(mockUser);

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        Object.keys(mockUser)
          .filter((key) => key !== 'password')
          .forEach((key) => {
            expect(res.body.user[key]).toBe(mockUser[key]);
          });
        expect(createSpy).toHaveBeenCalled();
        createSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('POST /signin', () => {
    it('rejects requests without both email and password', async (done) => {
      try {
        const attempts = ['email', 'password', ''].map(async (key) => {
          const user = key
            ? { [key]: mockUser[key] }
            : {};

          const res = await request
            .post('/signin')
            .send(user);

          expect(res.status).toBe(400);
        });
        await Promise.all(attempts);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('rejects emails with no associated users', async (done) => {
      try {
        const res = await request
          .post('/signin')
          .send({ email: 'not an email', password: mockUser.password });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Email address not associated with a user');
        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 401 on incorrect password', async (done) => {
      try {
        const res = await request
          .post('/signin')
          .send({ email: mockUser.email, password: 'wrong password' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Incorrect password');
        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns valid token and JSON user object', async (done) => {
      try {
        const res = await request.post('/signin').send(mockUser);
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        Object.keys(mockUser)
          .filter((key) => key !== 'password')
          .forEach((key) => {
            expect(res.body.user[key]).toBe(mockUser[key]);
          });

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('GET /jwt-signin', () => {
    it('requires jwt token', async (done) => {
      try {
        const res = await request.get('/jwt-signin');

        expect(res.status).toBe(401);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('sends user JSON corresponding to jwt', async (done) => {
      try {
        const res = await request
          .get('/jwt-signin')
          .set('Authorization', 'Bearer dummy_token');

        expect(res.status).toBe(200);
        Object.keys(mockUser)
          .filter((key) => key !== 'password')
          .forEach((key) => {
            expect(res.body.user[key]).toBe(mockUser[key]);
          });

        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
