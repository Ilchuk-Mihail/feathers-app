import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
import { Forbidden, Conflict } from '@feathersjs/errors';
import { disallow } from 'feathers-hooks-common';
import validate from 'feathers-validate-joi';
import { signUpSchema } from './users.validations';
import { iff, isProvider } from 'feathers-hooks-common';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const joiOptions = {
  abortEarly: false,
  convert: true,
  allowUnknown: false,
  stripUnknown: true
};

function isCurrent (context: HookContext): HookContext {
  if (context.params.user?.id !== context.id) {
    // try to access not own user data
    throw new Forbidden('access denied');
  }

  return context;
}

async function checkIfUserExists (context: HookContext): Promise<HookContext> {
  const result = await context.service.find({
    query: {
      email: context.data.email
    }
  });

  if (result.data.length) {
    throw new Conflict('email already exists');
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
      iff(isProvider('external'), isCurrent)
    ],
    create: [
      validate.form(signUpSchema, joiOptions),
      checkIfUserExists,
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
    remove: disallow('external')
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
