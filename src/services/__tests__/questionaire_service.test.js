// TODO: rewrite tests to have relevant fields
import { questionaireService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

let idQuestionaireA = '';
const invalidId = 'invalidId';

const questionaireDataA = {
  title: 'SF-36',
  author: 'Laurel Dernbach',
  standard_frequency: 'weekly',
  description: 'an assesment to determine quality of life',
  scoring_schema: {
    r_limit_phys: {
      13: {
        1: 0,
        2: 25
      },
      14: {
        1: 0,
        2: 25
      },
      15: {
        1: 0,
        2: 25
      },
      16: {
        1: 0,
        2: 25
      }
    },
  },
  questions: {
    1: {
      instructions: null,
      question: 'In general, would you say your health is:',
      response_type: 'mc',
      responses: {
        1: 'Excellent',
        2: 'Very good',
        3: 'Good',
        4: 'Fair',
        5: 'Poor'
      }
    },
  },
};

const questionaireDataB = {
  title: 'CDAI-RA',
  author: 'Laurel Dernbach',
  standard_frequency: 'monthly',
  description: 'an assesment to determine joint mobility',
  scoring_schema: {
    r_limit_phys: {
      13: {
        1: 0,
        2: 25
      },
      14: {
        1: 0,
        2: 25
      },
      15: {
        1: 0,
        2: 25
      },
      16: {
        1: 0,
        2: 25
      }
    },
  },
  questions: {
    1: {
      instructions: null,
      question: 'In general, would you say your health is:',
      response_type: 'mc',
      responses: {
        1: 'Excellent',
        2: 'Very good',
        3: 'Good',
        4: 'Fair',
        5: 'Poor'
      }
    },
  },
};

describe('questionaireService', () => {
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

  describe('createQuestionaire', () => {
    it('Can create questionaire', async (done) => {
      try {
        const questionaire = await questionaireService.createQuestionaire(questionaireDataA);

        idQuestionaireA = String(questionaire._id);

        expect(questionaire._id).toBeDefined();
        expect(questionaire.title).toBe(questionaireDataA.title);
        expect(questionaire.description).toBe(questionaireDataA.description);
        expect(questionaire.author).toBe(questionaireDataA.author);
        expect(questionaire.standard_frequency).toBe(questionaireDataA.standard_frequency);
        expect(questionaire.questions).toStrictEqual(questionaireDataA.questions);
        expect(questionaire.scoring_schema).toStrictEqual(questionaireDataA.scoring_schema);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Can create second questionaire', async (done) => {
      try {
        const questionaire = await questionaireService.createQuestionaire(questionaireDataB);

        expect(questionaire._id).toBeDefined();
        expect(questionaire.title).toBe(questionaireDataB.title);
        expect(questionaire.description).toBe(questionaireDataB.description);
        expect(questionaire.author).toBe(questionaireDataB.author);
        expect(questionaire.standard_frequency).toBe(questionaireDataB.standard_frequency);
        expect(questionaire.questions).toStrictEqual(questionaireDataB.questions);
        expect(questionaire.scoring_schema).toStrictEqual(questionaireDataB.scoring_schema);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('getQuestionaire', () => {
    it('Can get questionaire', async (done) => {
      try {
        const questionaire = await questionaireService.getQuestionaire(idQuestionaireA);

        expect(questionaire._id).toBeDefined();
        expect(questionaire.title).toBe(questionaireDataA.title);
        expect(questionaire.description).toBe(questionaireDataA.description);
        expect(questionaire.author).toBe(questionaireDataA.author);
        expect(questionaire.standard_frequency).toBe(questionaireDataA.standard_frequency);
        expect(questionaire.questions).toStrictEqual(questionaireDataA.questions);
        expect(questionaire.scoring_schema).toStrictEqual(questionaireDataA.scoring_schema);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if questionaire does not exist', async (done) => {
      try {
        await questionaireService.getQuestionaire(invalidId);

        done('Did not throw error on non-existant questionaire');
      } catch (error) {
        done();
      }
    });
  });

  describe('getManyQuestionaires', () => {
    it('Gets all questionaires when no filter passed in', async (done) => {
      try {
        const questionaires = await questionaireService.getManyQuestionaires({});

        expect(questionaires.length).toBe(2);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Gets all questionaires that match filter', async (done) => {
      try {
        const questionaires = await questionaireService.getManyQuestionaires({ title: questionaireDataA.title });

        expect(questionaires.length).toBe(1);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('updateQuestionaire', () => {
    it('Updates questionaire field, returns updated questionaire', async (done) => {
      const newDescription = 'Updated description';
      try {
        const updatedquestionaire = await questionaireService.updateQuestionaire(idQuestionaireA, { description: newDescription });

        expect(updatedquestionaire.description).toBe(newDescription);

        done();
      } catch (error) {
        done(error);
      }

      try {
        const updatedquestionaire = await questionaireService.getQuestionaire(idQuestionaireA);

        expect(updatedquestionaire.description).toBe(newDescription);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if questionaire does not exist', async (done) => {
      try {
        await questionaireService.updateQuestionaire(invalidId, { title: 'gabagoo' });

        done('Did not throw error on non-existant questionaire');
      } catch (error) {
        done();
      }
    });

    it('Does not add field thats not part of schema', async (done) => {
      try {
        const questionaire = await questionaireService.updateQuestionaire(idQuestionaireA, { director: 'Wendey Stanzler' });

        expect(questionaire.director).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('deleteQuestionaire', () => {
    it('Deletes existing questionaire', async (done) => {
      try {
        await questionaireService.deleteQuestionaire(idQuestionaireA);
      } catch (error) {
        done(error);
      }

      try {
        await questionaireService.getQuestionaire(idQuestionaireA);

        done('Did not throw error on non-existant questionaire');
      } catch (error) {
        done();
      }
    });
  });

  it('Throws error if questionaire does not exist', async (done) => {
    try {
      await questionaireService.deleteQuestionaire(invalidId);

      done('Did not throw error on non-existant questionaire');
    } catch (error) {
      done();
    }
  });
});
