import assert from 'assert';
import app from '../../src/app';

describe('\'users\' service', () => {
  const testEmail = 'test2@email.com';
  let service;

  after(async function () {
    const user = await service.find({
      query: { email: testEmail }
    });

    await service.remove(user.data[0].id);
  });

  it('registered the service', () => {
    service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  it('creates a user and encrypts password', async () => {
    const user = await service.create({
      email: testEmail,
      password: 'secret'
    });

    // Makes sure the password got encrypted
    assert.ok(user.password !== 'secret');
  });
});
