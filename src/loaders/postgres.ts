import { connect } from '../../deps.ts';
import env from '../config/env.ts';

export default async () => {
  console.log('Connecting to DB...');

  try {
    const db = await connect({
      type: 'postgres',
      ...env.DB_CONFIG,
    });

    console.log('Testing DB connection...');
    await db.query('SELECT * FROM users');

    console.log('DB connected!');

    return db;
  } catch (err) {
    console.log(err.message, err);
  }
};
