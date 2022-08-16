import supertest from 'supertest';
import responseRouter from 'routers/response_router';
import { responseService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

const request = supertest(responseRouter);

// commented out tests have to do with validation
// there is currently no validation scheme for the response model
// because its implementation is still being developed
// and is therefore better left fluid

const responseDataA = {
  // date: '2022-08-11T15:58:30.014Z',
  responses: { 1: '2' },
  scores: { gen_health: 56.85 },
};

const responseDataB = {
  // date: '2022-08-11T15:58:30.014Z',
  responses: { 1: '3' },
  scores: { gen_health: 72.00 },
};

let validId = '';
const invalidId = 'invalidId';

// Mocks requireAuth server middleware
jest.mock('../../authentication/requireAuth');

describe('Working response router', () => {
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

  describe('POST /', () => {
    it('requires valid permissions', async (done) => {
      try {
        const createSpy = jest.spyOn(responseService, 'createResponse');

        const res = await request
          .post('/')
          .send(responseDataA);

        expect(res.status).toBe(401);
        expect(createSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    // it('blocks creation when missing field', async (done) => {
    //   try {
    //     const createSpy = jest.spyOn(responseService, 'createResponse');

    //     const attempts = Object.keys(responseDataA).map(async (key) => {
    //       const response = { ...responseDataA };
    //       delete response[key];

    //       const res = await request
    //         .post('/')
    //         .set('Authorization', 'Bearer dummy_token')
    //         .send(response);

    //       expect(res.status).toBe(400);
    //       expect(res.body.errors.length).toBe(1);
    //       expect(createSpy).not.toHaveBeenCalled();
    //     });
    //     await Promise.all(attempts);

    //     done();
    //   } catch (error) {
    //     done(error);
    //   }
    // });

    // it('blocks creation when field invalid', async (done) => {
    //   try {
    //     const createSpy = jest.spyOn(responseService, 'createResponse');

    //     const attempts = Object.keys(responseDataA).map(async (key) => {
    //       const response = { ...responseDataA };
    //       response[key] = typeof response[key] === 'number'
    //         ? 'some string'
    //         : 0;

    //       const res = await request
    //         .post('/')
    //         .set('Authorization', 'Bearer dummy_token')
    //         .send(response);

    //       expect(res.status).toBe(400);
    //       expect(res.body.errors.length).toBe(1);
    //       expect(createSpy).not.toHaveBeenCalled();
    //     });
    //     await Promise.all(attempts);

    //     done();
    //   } catch (error) {
    //     done(error);
    //   }
    // });

    it('creates response when body is valid', async (done) => {
      try {
        const createSpy = jest.spyOn(responseService, 'createResponse');

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(responseDataA);

        expect(res.status).toBe(201);
        Object.keys(responseDataA).forEach((key) => {
          expect(res.body[key]).toStrictEqual(responseDataA[key]);
        });
        expect(createSpy).toHaveBeenCalled();
        createSpy.mockClear();

        validId = String(res.body._id);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('GET /', () => {
    it('returns all created responses', async (done) => {
      try {
        const getManySpy = jest.spyOn(responseService, 'getManyResponses');

        const res = await request.get('/');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(getManySpy).toHaveBeenCalled();
        getManySpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('GET /:id', () => {
    it('returns 404 when response not found', async (done) => {
      try {
        const getSpy = jest.spyOn(responseService, 'getResponse');

        const res = await request.get(`/${invalidId}`);

        expect(res.status).toBe(404);
        expect(getSpy).rejects.toThrowError();
        getSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns response if found', async (done) => {
      try {
        const getSpy = jest.spyOn(responseService, 'getResponse');

        const res = await request.get(`/${validId}`);

        expect(res.status).toBe(200);
        Object.keys(responseDataA).forEach((key) => {
          expect(res.body[key]).toStrictEqual(responseDataA[key]);
        });
        expect(getSpy).toHaveBeenCalled();
        getSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('PUT /:id', () => {
    it('requires valid permissions', async (done) => {
      try {
        const updateSpy = jest.spyOn(responseService, 'updateResponse');

        const res = await request
          .put(`/${validId}`)
          .send({ scores: { gen_health: 56.85 } });

        expect(res.status).toBe(401);
        expect(updateSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 404 if response not found', async (done) => {
      try {
        const updateSpy = jest.spyOn(responseService, 'updateResponse');

        const res = await request
          .put(`/${invalidId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send({ scores: { gen_health: 56.85 } });

        expect(res.status).toBe(404);
        expect(updateSpy).rejects.toThrowError();
        updateSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });

    // it('blocks creation when field invalid', async (done) => {
    //   try {
    //     const updateSpy = jest.spyOn(responseService, 'updateResponse');

    //     const attempts = Object.keys(responseDataA).concat('otherkey').map(async (key) => {
    //       const responseUpdate = {
    //         [key]: typeof responseDataA[key] === 'number'
    //           ? 'some string'
    //           : 0,
    //       };

    //       const res = await request
    //         .put(`/${validId}`)
    //         .set('Authorization', 'Bearer dummy_token')
    //         .send(responseUpdate);

    //       expect(res.status).toBe(400);
    //       expect(res.body.errors.length).toBe(1);
    //       expect(updateSpy).not.toHaveBeenCalled();
    //     });
    //     await Promise.all(attempts);

    //     done();
    //   } catch (error) {
    //     done(error);
    //   }
    // });

    it('updates response when body is valid', async (done) => {
      try {
        const updateSpy = jest.spyOn(responseService, 'updateResponse');

        const attempts = Object.keys(responseDataB).map(async (key) => {
          const responseUpdate = { [key]: responseDataB[key] };

          const res = await request
            .put(`/${validId}`)
            .set('Authorization', 'Bearer dummy_token')
            .send(responseUpdate);

          expect(res.status).toBe(200);
          expect(res.body[key]).toStrictEqual(responseDataB[key]);
        });
        await Promise.all(attempts);

        expect(updateSpy).toHaveBeenCalledTimes(Object.keys(responseDataB).length);
        updateSpy.mockClear();

        const res = await request.get(`/${validId}`);

        Object.keys(responseDataB).forEach((key) => {
          expect(res.body[key]).toStrictEqual(responseDataB[key]);
        });

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async (done) => {
      try {
        const deleteSpy = jest.spyOn(responseService, 'deleteResponse');

        const res = await request.delete(`/${validId}`);

        expect(res.status).toBe(401);
        expect(deleteSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 404 if response not found', async (done) => {
      try {
        const deleteSpy = jest.spyOn(responseService, 'deleteResponse');

        const res = await request
          .delete(`/${invalidId}`)
          .set('Authorization', 'Bearer dummy_token');

        expect(res.status).toBe(404);
        expect(deleteSpy).rejects.toThrowError();
        deleteSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('deletes response', async (done) => {
      try {
        const deleteSpy = jest.spyOn(responseService, 'deleteResponse');

        const res = await request
          .delete(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token');

        expect(res.status).toBe(200);
        expect(deleteSpy).toHaveBeenCalled();
        deleteSpy.mockClear();

        const getRes = await request.get(`/${validId}`);
        expect(getRes.status).toBe(404);

        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
