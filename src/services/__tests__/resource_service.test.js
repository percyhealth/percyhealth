import { resourceService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

let idResourceA = '';
const invalidId = 'invalidId';

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

describe('resourceService', () => {
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

  describe('createResource', () => {
    it('Can create resource', async (done) => {
      try {
        const resource = await resourceService.createResource(resourceDataA);

        idResourceA = String(resource._id);

        expect(resource._id).toBeDefined();
        expect(resource.title).toBe(resourceDataA.title);
        expect(resource.description).toBe(resourceDataA.description);
        expect(resource.value).toBe(resourceDataA.value);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Can create second resource', async (done) => {
      try {
        const resource = await resourceService.createResource(resourceDataB);

        expect(resource._id).toBeDefined();
        expect(resource.title).toBe(resourceDataB.title);
        expect(resource.description).toBe(resourceDataB.description);
        expect(resource.value).toBe(resourceDataB.value);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('getResource', () => {
    it('Can get resource', async (done) => {
      try {
        const resource = await resourceService.getResource(idResourceA);

        expect(resource.title).toBe(resourceDataA.title);
        expect(resource.description).toBe(resourceDataA.description);
        expect(resource.value).toBe(resourceDataA.value);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if resource does not exist', async (done) => {
      try {
        await resourceService.getResource(invalidId);

        done('Did not throw error on non-existant resource');
      } catch (error) {
        done();
      }
    });
  });

  describe('getManyResources', () => {
    it('Gets all resources when no filter passed in', async (done) => {
      try {
        const resources = await resourceService.getManyResources({});

        expect(resources.length).toBe(2);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Gets all resources that match filter', async (done) => {
      try {
        const resources = await resourceService.getManyResources({ value: resourceDataA.value });

        expect(resources.length).toBe(1);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('updateResource', () => {
    it('Updates resource field, returns updated resource', async (done) => {
      const newDescription = 'Stop....pooping';
      try {
        const updatedresource = await resourceService.updateResource(idResourceA, { description: newDescription });

        expect(updatedresource.description).toBe(newDescription);

        done();
      } catch (error) {
        done(error);
      }

      try {
        const updatedresource = await resourceService.getResource(idResourceA);

        expect(updatedresource.description).toBe(newDescription);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if resource does not exist', async (done) => {
      try {
        await resourceService.updateResource(invalidId, { value: 10000 });

        done('Did not throw error on non-existant resource');
      } catch (error) {
        done();
      }
    });

    it('Does not add field thats not part of schema', async (done) => {
      try {
        const resource = await resourceService.updateResource(idResourceA, { director: 'Wendey Stanzler' });

        expect(resource.director).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('deleteResource', () => {
    it('Deletes existing resource', async (done) => {
      try {
        await resourceService.deleteResource(idResourceA);
      } catch (error) {
        done(error);
      }

      try {
        await resourceService.getResource(idResourceA);

        done('Did not throw error on non-existant resource');
      } catch (error) {
        done();
      }
    });
  });

  it('Throws error if resource does not exist', async (done) => {
    try {
      await resourceService.deleteResource(invalidId);

      done('Did not throw error on non-existant resource');
    } catch (error) {
      done();
    }
  });
});
