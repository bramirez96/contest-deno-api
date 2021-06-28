import { connect } from '../../deps.ts';
import env from '../config/env.ts';

export default {
  main: async () => {
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
      console.log(env.DB_CONFIG);
      console.log(err.message, err);
    }
  },
  ds: async () => {
    console.log('Connecting to DS DB...');

    try {
      const db = await connect({
        type: 'postgres',
        ...env.DS_DB_CONFIG,
      });

      console.log('Testing DS DB connection...');
      await db.query('SELECT * FROM submissions');

      console.log('DS DB connected!');

      return db;
    } catch (err) {
      console.log(env.DS_DB_CONFIG);
      console.log(err.message, err);
    }
  },
};
