import type { DenonConfig } from 'https://deno.land/x/denon@2.4.6/mod.ts';
import { config as env } from 'https://deno.land/x/dotenv@v2.0.0/mod.ts';

const config: DenonConfig = {
  tsconfig: 'tsconfig.json',
  unstable: true,
  allow: ['env', 'read', 'net'],
  env: env(), // Contrary to the documentation this is vital
  scripts: {
    start: {
      cmd: 'deno run src/mod.ts start',
    },
    dev: {
      cmd: 'deno run src/mod.ts start',
    },
    test: {
      cmd: 'deno test __tests__/index.test.ts',
      env: {
        DENO_ENV: 'testing', // Set the testing environment
      },
    },
  },
};

export default config;
