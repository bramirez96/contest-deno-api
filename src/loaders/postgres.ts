import { Client } from '../../deps.ts';
import env from '../config/env.ts';

export default async () => {
  const client = new Client(env.DB_CONFIG);

  console.log('Connecting to DB...');
  await client.connect();
  console.log('DB connected!');

  return client;
};
