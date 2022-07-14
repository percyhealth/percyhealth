import bcrypt from 'bcrypt';

import { userService } from 'services';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

let idUserA = '';
const invalidId = 'invalidId';

const userDataA = {
  email: 'garrygergich@test.com',
  password: 'muncie',
  first_name: 'Garry',
  last_name: 'Gergich',
};

const userDataB = {
  email: 'benwyatt@test.com',
  password: 'icetown',
  first_name: 'Ben',
  last_name: 'Wyatt',
};

describe('userService', () => {
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

  describe('createUser', () => {
    it('Can create user', async (done) => {
      try {
        const user = await userService.createUser(userDataA);

        expect(user._id).toBeDefined();
        expect(user.email).toBe(userDataA.email);
        expect(user.first_name).toBe(userDataA.first_name);
        expect(user.last_name).toBe(userDataA.last_name);

        const passCompareResult = await new Promise((resolve, reject) => {
          bcrypt.compare(userDataA.password, user.password, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });

        expect(passCompareResult).toBe(true);

        idUserA = String(user._id);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if email already used', async (done) => {
      try {
        await userService.createUser(userDataA);

        done('Allowed email to be used multiple times');
      } catch (error) {
        done();
      }
    });

    it('Can create second user', async (done) => {
      try {
        const user = await userService.createUser(userDataB);

        expect(user._id).toBeDefined();
        expect(user.email).toBe(userDataB.email);
        expect(user.first_name).toBe(userDataB.first_name);
        expect(user.last_name).toBe(userDataB.last_name);

        const passCompareResult = await new Promise((resolve, reject) => {
          bcrypt.compare(userDataB.password, user.password, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });

        expect(passCompareResult).toBe(true);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('getUser', () => {
    it('Can get user', async (done) => {
      try {
        const user = await userService.getUser(idUserA);

        expect(user.email).toBe(userDataA.email);
        expect(user.password).not.toBe(userDataA.password);
        expect(user.first_name).toBe(userDataA.first_name);
        expect(user.last_name).toBe(userDataA.last_name);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if user does not exist', async (done) => {
      try {
        await userService.getUser(invalidId);

        done('Did not throw error on non-existant user');
      } catch (error) {
        done();
      }
    });
  });

  describe('getManyUsers', () => {
    it('Gets all users when no filter passed in', async (done) => {
      try {
        const users = await userService.getManyUsers({});

        expect(users.length).toBe(2);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Gets all users that match filter', async (done) => {
      try {
        const users = await userService.getManyUsers({ first_name: userDataA.first_name });

        expect(users.length).toBe(1);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('updateUser', () => {
    it('Updates user field', async (done) => {
      const newName = 'Jerry';
      try {
        const updatedUser = await userService.updateUser(idUserA, { first_name: newName });

        expect(updatedUser.first_name).toBe(newName);

        done();
      } catch (error) {
        done(error);
      }

      try {
        const updatedUser = await userService.getUser(idUserA);

        expect(updatedUser.first_name).toBe(newName);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Throws error if user does not exist', async (done) => {
      try {
        await userService.updateUser(invalidId, { first_name: 'Larry' });

        done('Did not throw error on non-existant user');
      } catch (error) {
        done();
      }
    });

    it('Does not add field thats not part of schema', async (done) => {
      try {
        const user = await userService.updateUser(idUserA, { favorite_food: 'Brussel Sprouts' });

        expect(user.favorite_food).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('isEmailAvailable', () => {
    it('Know if email is available', async (done) => {
      try {
        const emailAvailable = await userService.isEmailAvailable('jerrygergich@test.com');

        expect(emailAvailable).toBe(true);

        done();
      } catch (error) {
        done(error);
      }
    });

    it('Know if email is not available', async (done) => {
      try {
        const emailAvailable = await userService.isEmailAvailable(userDataA.email);

        expect(emailAvailable).toBe(false);

        done();
      } catch (error) {
        done(error);
      }
    });
  });

  describe('deleteUser', () => {
    it('Deletes existing user', async (done) => {
      try {
        await userService.deleteUser(idUserA);
      } catch (error) {
        done(error);
      }

      try {
        await userService.getUser(idUserA);

        done('Did not throw error on non-existant user');
      } catch (error) {
        done();
      }
    });

    it('Throws error if user does not exist', async (done) => {
      try {
        await userService.deleteUser(invalidId);

        done('Did not throw error on non-existant user');
      } catch (error) {
        done();
      }
    });
  });
});
