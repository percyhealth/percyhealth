import supertest from 'supertest';
import questionaireRouter from 'routers/questionaire_router';
import { questionaireService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

const request = supertest(questionaireRouter);

const questionaireDataA = {
  title: 'SF-36',
  author: 'Laurel Dernbach',
  standard_frequency: 'weekly',
  description: 'an assesment to determine quality of life',
  scoring_schema: [],
  questions: []
};

const questionaireDataB = {
  title: 'CDAI-RA',
  author: 'Laurel Dernbach',
  standard_frequency: 'monthly',
  description: 'an assesment to determine joint mobility',
  // scoring_schema: [],
  questions: [{
    question_number: 1,
    prompt: 'In general, would you say your health is:',
    response_type: 'Multi-choice',
    reponse: [
      {
        option1: 'Excellent',
        answer: true,
        score_val: 100
      },
      {
        option2: 'Very good',
        answer: false,
        score_val: 75
      },
      {
        option3: 'Good',
        answer: false,
        score_val: 50
      },
      {
        option4: 'Fair',
        answer: false,
        score_val: 25
      },
      {
        option5: 'Poor',
        answer: false,
        score_val: 0
      }
    ],
  }]
};

let validId = '';
const invalidId = 'invalidId';

// Mocks requireAuth server middleware
jest.mock('../../authentication/requireAuth');

describe('Working questionaire router', () => {
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
        const createSpy = jest.spyOn(questionaireService, 'createQuestionaire');

        const res = await request
          .post('/')
          .send(questionaireDataA);

        expect(res.status).toBe(401);
        expect(createSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('blocks creation when missing field', async (done) => {
      try {
        const createSpy = jest.spyOn(questionaireService, 'createQuestionaire');

        const attempts = Object.keys(questionaireDataA).map(async (key) => {
          const questionaire = { ...questionaireDataA };
          delete questionaire[key];

          const res = await request
            .post('/')
            .set('Authorization', 'Bearer dummy_token')
            .send(questionaire);

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
        const createSpy = jest.spyOn(questionaireService, 'createQuestionaire');

        const attempts = Object.keys(questionaireDataA).map(async (key) => {
          const questionaire = { ...questionaireDataA };
          questionaire[key] = typeof questionaire[key] === 'number'
            ? 'some string'
            : 0;

          const res = await request
            .post('/')
            .set('Authorization', 'Bearer dummy_token')
            .send(questionaire);

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

    it('creates questionaire when body is valid', async (done) => {
      try {
        const createSpy = jest.spyOn(questionaireService, 'createQuestionaire');

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(questionaireDataA);

        expect(res.status).toBe(201);
        console.log('LINE 132', res.body);
        Object.keys(questionaireDataA).forEach((key) => {
          // changed .toBe to .toStrictEqual for array comparison
          expect(res.body[key]).toStrictEqual(questionaireDataA[key]);
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
    it('returns all created questionaires', async (done) => {
      try {
        const getManySpy = jest.spyOn(questionaireService, 'getManyQuestionaires');

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
    it('returns 404 when questionaire not found', async (done) => {
      try {
        const getSpy = jest.spyOn(questionaireService, 'getQuestionaire');

        const res = await request.get(`/${invalidId}`);

        expect(res.status).toBe(404);
        expect(getSpy).rejects.toThrowError();
        getSpy.mockClear();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns questionaire if found', async (done) => {
      try {
        const getSpy = jest.spyOn(questionaireService, 'getQuestionaire');

        const res = await request.get(`/${validId}`);

        expect(res.status).toBe(200);
        Object.keys(questionaireDataA).forEach((key) => {
          // changed from .toBe to .toStrictEqual for array comparison
          expect(res.body[key]).toStrictEqual(questionaireDataA[key]);
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
        const updateSpy = jest.spyOn(questionaireService, 'updateQuestionaire');

        const res = await request
          .put(`/${validId}`)
          .send({ author: 'new author' });

        expect(res.status).toBe(401);
        expect(updateSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 404 if questionaire not found', async (done) => {
      try {
        const updateSpy = jest.spyOn(questionaireService, 'updateQuestionaire');

        const res = await request
          .put(`/${invalidId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send({ author: 'new author' });

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
        const updateSpy = jest.spyOn(questionaireService, 'updateQuestionaire');

        const attempts = Object.keys(questionaireDataA).concat('otherkey').map(async (key) => {
          const questionaireUpdate = {
            [key]: typeof questionaireDataA[key] === 'number'
              ? 'some string'
              : 0,
          };

          const res = await request
            .put(`/${validId}`)
            .set('Authorization', 'Bearer dummy_token')
            .send(questionaireUpdate);

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

    it('updates questionaire when body is valid', async (done) => {
      try {
        const updateSpy = jest.spyOn(questionaireService, 'updateQuestionaire');

        const attempts = Object.keys(questionaireDataB).map(async (key) => {
          const questionaireUpdate = { [key]: questionaireDataB[key] };

          const res = await request
            .put(`/${validId}`)
            .set('Authorization', 'Bearer dummy_token')
            .send(questionaireUpdate);

          expect(res.status).toBe(200);
          // changed from .toBe to .toStrictEqual for array comparison
          expect(res.body[key]).toStrictEqual(questionaireDataB[key]);
        });
        await Promise.all(attempts);

        expect(updateSpy).toHaveBeenCalledTimes(Object.keys(questionaireDataB).length);
        updateSpy.mockClear();

        const res = await request.get(`/${validId}`);

        Object.keys(questionaireDataB).forEach((key) => {
          // changed from .toBe to .toStrictEqual for array comparison
          expect(res.body[key]).toStrictEqual(questionaireDataB[key]);
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
        const deleteSpy = jest.spyOn(questionaireService, 'deleteQuestionaire');

        const res = await request.delete(`/${validId}`);

        expect(res.status).toBe(401);
        expect(deleteSpy).not.toHaveBeenCalled();

        done();
      } catch (error) {
        done(error);
      }
    });

    it('returns 404 if questionaire not found', async (done) => {
      try {
        const deleteSpy = jest.spyOn(questionaireService, 'deleteQuestionaire');

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

    it('deletes questionaire', async (done) => {
      try {
        const deleteSpy = jest.spyOn(questionaireService, 'deleteQuestionaire');

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
