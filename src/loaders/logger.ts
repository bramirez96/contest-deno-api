import { log } from '../../deps.ts';
import env from '../config/env.ts';

export default async () => {
  console.log('Initializing logger...');
  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler('DEBUG', {
        formatter: '[{levelName}] {msg}',
      }),
    },
    loggers: {
      default: {
        level: 'DEBUG',
        handlers: ['console'],
      },
      development: {
        level: 'DEBUG',
        handlers: ['console'],
      },
      production: {
        level: 'DEBUG',
        handlers: ['console'],
      },
      testing: {
        level: 'CRITICAL',
        handlers: ['console'],
      },
    },
  });
  console.log('Logger initialized!');

  return log.getLogger(env.DENO_ENV);
};
