import { HookContext } from '@feathersjs/feathers';
import { GeneralError } from '@feathersjs/errors';

const errorHandler = (context: HookContext): HookContext => {
  const error = context.error;
 
  if (!error.code) {
    const newError = new GeneralError('internal server error');
    context.error = newError;
    return context;
  }

  if (error.code === 404 || process.env.NODE_ENV === 'production') {
    error.stack = null;
  }

  // custom error interface ? 
  // error.className = undefined;
  // error.data = undefined;

  return context;
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      errorHandler
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
