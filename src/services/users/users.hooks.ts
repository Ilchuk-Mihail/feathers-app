import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';
import { disallow } from 'feathers-hooks-common';
import validate from 'feathers-validate-joi';
import { signUpSchema } from './users.validations';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

function isCurrent (context: HookContext): HookContext {
  if (context.params.provider && context.params.user?.id !== context.id) {
    // try to access not own user data
    throw new Forbidden('access denied');
  }

  return context;
}

export default {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
    ],
    get: [
      authenticate('jwt'),
      isCurrent,
    ],
    create: [
      validate.form(signUpSchema, {}),
      hashPassword('password')
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt')
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt')
    ],
    remove: disallow()
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
