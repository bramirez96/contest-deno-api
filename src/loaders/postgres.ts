import { connect } from '../../deps.ts';
import env from '../config/env.ts';

export default async () => {
  console.log('Connecting to DB...');

  const db = await connect({
    type: 'postgres',
    ...env.DB_CONFIG,
  });

  console.log('DB connected!');

  return db;
};
