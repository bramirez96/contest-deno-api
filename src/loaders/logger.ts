import { log } from '../../deps.ts';

export default async (name?: string) => {
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
      testing: {
        level: 'WARNING',
        handlers: ['console'],
      },
    },
  });
  console.log('Logger initialized!');

  return log.getLogger(name);
};
