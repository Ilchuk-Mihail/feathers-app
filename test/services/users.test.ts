import { expect } from 'chai';
import app from '../../src/app';

describe('\'users\' service', () => {
  const testEmail = 'test2@email.com';
  let service;

  // after(async function () {
  //   const user = await service.find({
  //     query: { email: testEmail }
  //   });

  //   await service.remove(user.data[0].id);
  // });

  it('registered the service', () => {
    service = app.service('users');

    expect(service).to.not.be.null;
  });

  it('creates a user and encrypts password', async () => {
    const user = await service.create({
      email: testEmail,
      password: 'secret'
    });

    expect(user.password).not.to.equal('secret');
  });

  it('fail with error a user already exists', async () => {
    try {
      await service.create({
        email: testEmail,
        password: 'secret'
      });
      expect.fail('call should have failed');
    } catch (err: any) {
      expect(err.message).to.equal('email already exists');
      expect(err.code).to.equal(409);
    }
  });
});
