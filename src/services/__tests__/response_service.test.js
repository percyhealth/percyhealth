import { responseService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

let idResponseA = '';
const invalidId = 'invalidId';

const responseDataA = {
  // date should be auto generated upon creation
  // date: '2022-08-11T15:58:30.014Z',
  responses: { 1: '2' },
  scores: { gen_health: 56.85 },
};

const responseDataB = {
  // date: '2022-08-11T15:58:30.014Z',
  responses: { 1: '3' },
  scores: { gen_health: 72.00 },
};

describe('responseService', () => {
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

  describe('createResponse', () => {
    it('Can create response', async (done) => {
      try {
        const response = await responseService.createResponse(responseDataA);

        idResponseA = String(response._id);

        expect(response._id).toBeDefined();
        // Date.now() is making this break
        // expect(response.date).toBe(responseDataA.date);
        expect(response.responses).toStrictEqual(responseDataA.responses);
        expect(response.scores).toStrictEqual(responseDataA.scores);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Can create second response', async (done) => {
      try {
        const response = await responseService.createResponse(responseDataB);

        expect(response._id).toBeDefined();
        // expect(response.date).toBe(responseDataB.date);
        expect(response.responses).toBe(responseDataB.responses);
        expect(response.scores).toBe(responseDataB.scores);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('getResponse', () => {
    it('Can get response', async (done) => {
      try {
        const response = await responseService.getResponse(idResponseA);

        // expect(response.date).toBe(responseDataA.date);
        expect(response.responses).toStrictEqual(responseDataA.responses);
        expect(response.scores).toStrictEqual(responseDataA.scores);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if response does not exist', async (done) => {
      try {
        await responseService.getResponse(invalidId);

        done('Did not throw error on non-existant response');
      } catch (error) {
        done();
      }
    });
  });

  describe('getManyResponses', () => {
    it('Gets all responses when no filter passed in', async (done) => {
      try {
        const responses = await responseService.getManyResponses({});

        expect(responses.length).toBe(2);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Gets all responses that match filter', async (done) => {
      try {
        const responses = await responseService.getManyResponses({ responses: responseDataA.responses });

        expect(responses.length).toBe(1);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('updateResponse', () => {
    it('Updates response field, returns updated response', async (done) => {
      const newResponse = { 1: '2', 2: '3' };
      try {
        const updatedresponse = await responseService.updateResponse(idResponseA, { responses: newResponse });

        expect(updatedresponse.responses).toStrictEqual(newResponse);

        done();
      } catch (error) {
        done(error);
      }

      try {
        const updatedresponse = await responseService.getResponse(idResponseA);

        expect(updatedresponse.responses).toStrictEqual(newResponse);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if response does not exist', async (done) => {
      try {
        await responseService.updateResponse(invalidId, { scores: { fake_score: 3004 } });

        done('Did not throw error on non-existant response');
      } catch (error) {
        done();
      }
    });

    it('Does not add field thats not part of schema', async (done) => {
      try {
        const response = await responseService.updateResponse(idResponseA, { director: 'Wendey Stanzler' });

        expect(response.director).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('deleteResponse', () => {
    it('Deletes existing response', async (done) => {
      try {
        await responseService.deleteResponse(idResponseA);
      } catch (error) {
        done(error);
      }

      try {
        await responseService.getResponse(idResponseA);

        done('Did not throw error on non-existant response');
      } catch (error) {
        done();
      }
    });
  });

  it('Throws error if response does not exist', async (done) => {
    try {
      await responseService.deleteResponse(invalidId);

      done('Did not throw error on non-existant response');
    } catch (error) {
      done();
    }
  });
});
