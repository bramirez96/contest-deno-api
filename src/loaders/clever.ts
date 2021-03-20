import env from '../config/env.ts';
import { CleverClient } from '../lib/clever_library/mod.ts';

export default () => {
  console.log('Initializing clever client...');

  const client = new CleverClient({
    ...env.CLEVER_CONFIG,
    apiVersion: 'v2.1',
  });

  console.log('Clever initialized!');
  return client;
};
