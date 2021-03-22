import { CleverClient } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Initializing clever client...');

  const client = new CleverClient({
    ...env.CLEVER_CONFIG,
    apiVersion: 'v2.1',
  });

  console.log('Clever initialized!');
  return client;
};
