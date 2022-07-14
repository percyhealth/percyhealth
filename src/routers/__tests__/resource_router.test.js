import supertest from 'supertest';
import resourceRouter from 'routers/resource_router';
import { resourceService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

const request = supertest(resourceRouter);

const resourceDataA = {
  title: 'Flu Season',
  description: 'Leslie comes down with the flu while planning the local Harvest Festival; Andy and Ron bond.',
  value: 32,
};

const resourceDataB = {
  title: 'Time Capsule',
  description: 'Leslie plans to bury a time capsule that summarizes life in Pawnee; Andy asks Chris for help.',
  value: 33,
};

let validId = '';
const invalidId = 'invalidId';

// Mocks requireAuth server middleware
jest.mock('../../authentication/requireAuth');

describe('Working resource router', () => {
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
        const createSpy = jest.spyOn(resourceService, 'createResource');

        const res = await request
          .post('/')
          .send(resourceDataA);

        expect(res.status).toBe(401);
        expect(createSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('blocks creation when missing field', async (done) => {
      try {
        const createSpy = jest.spyOn(resourceService, 'createResource');

        const attempts = Object.keys(resourceDataA).map(async (key) => {
          const resource = { ...resourceDataA };
          delete resource[key];

          const res = await request
            .post('/')
            .set('Authorization', 'Bearer dummy_token')
            .send(resource);

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
        const createSpy = jest.spyOn(resourceService, 'createResource');

        const attempts = Object.keys(resourceDataA).map(async (key) => {
          const resource = { ...resourceDataA };
          resource[key] = typeof resource[key] === 'number'
            ? 'some string'
            : 0;

          const res = await request
            .post('/')
            .set('Authorization', 'Bearer dummy_token')
            .send(resource);

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

    it('creates resource when body is valid', async (done) => {
      try {
        const createSpy = jest.spyOn(resourceService, 'createResource');

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(resourceDataA);

        expect(res.status).toBe(201);
        Object.keys(resourceDataA).forEach((key) => {
          expect(res.body[key]).toBe(resourceDataA[key]);
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
    it('returns all created resources', async (done) => {
      try {
        const getManySpy = jest.spyOn(resourceService, 'getManyResources');

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
    it('returns 404 when resource not found', async (done) => {
      try {
        const getSpy = jest.spyOn(resourceService, 'getResource');

        const res = await request.get(`/${invalidId}`);

        expect(res.status).toBe(404);
        expect(getSpy).rejects.toThrowError();
        getSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns resource if found', async (done) => {
      try {
        const getSpy = jest.spyOn(resourceService, 'getResource');

        const res = await request.get(`/${validId}`);

        expect(res.status).toBe(200);
        Object.keys(resourceDataA).forEach((key) => {
          expect(res.body[key]).toBe(resourceDataA[key]);
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
        const updateSpy = jest.spyOn(resourceService, 'updateResource');

        const res = await request
          .put(`/${validId}`)
          .send({ value: 32 });

        expect(res.status).toBe(401);
        expect(updateSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 404 if resource not found', async (done) => {
      try {
        const updateSpy = jest.spyOn(resourceService, 'updateResource');

        const res = await request
          .put(`/${invalidId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send({ value: 32 });

        expect(res.status).toBe(404);
        expect(updateSpy).rejects.toThrowError();
        updateSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('blocks creation when field invalid', async (done) => {
      try {
        const updateSpy = jest.spyOn(resourceService, 'updateResource');

        const attempts = Object.keys(resourceDataA).concat('otherkey').map(async (key) => {
          const resourceUpdate = {
            [key]: typeof resourceDataA[key] === 'number'
              ? 'some string'
              : 0,
          };

          const res = await request
            .put(`/${validId}`)
            .set('Authorization', 'Bearer dummy_token')
            .send(resourceUpdate);

          expect(res.status).toBe(400);
          expect(res.body.errors.length).toBe(1);
          expect(updateSpy).not.toHaveBeenCalled();
        });
        await Promise.all(attempts);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('updates resource when body is valid', async (done) => {
      try {
        const updateSpy = jest.spyOn(resourceService, 'updateResource');

        const attempts = Object.keys(resourceDataB).map(async (key) => {
          const resourceUpdate = { [key]: resourceDataB[key] };

          const res = await request
            .put(`/${validId}`)
            .set('Authorization', 'Bearer dummy_token')
            .send(resourceUpdate);

          expect(res.status).toBe(200);
          expect(res.body[key]).toBe(resourceDataB[key]);
        });
        await Promise.all(attempts);

        expect(updateSpy).toHaveBeenCalledTimes(Object.keys(resourceDataB).length);
        updateSpy.mockClear();

        const res = await request.get(`/${validId}`);

        Object.keys(resourceDataB).forEach((key) => {
          expect(res.body[key]).toBe(resourceDataB[key]);
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
        const deleteSpy = jest.spyOn(resourceService, 'deleteResource');

        const res = await request.delete(`/${validId}`);

        expect(res.status).toBe(401);
        expect(deleteSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 404 if resource not found', async (done) => {
      try {
        const deleteSpy = jest.spyOn(resourceService, 'deleteResource');

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

    it('deletes resource', async (done) => {
      try {
        const deleteSpy = jest.spyOn(resourceService, 'deleteResource');

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
