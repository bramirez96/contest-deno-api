import { serviceCollection } from '../../deps.ts';
import bucket from './bucket.ts';
import clever from './clever.ts';
import logger from './logger.ts';
import mailer from './mailer.ts';
import postgres from './postgres.ts';
import redis from './redis.ts';

export default async () => {
  try {
    const log = await logger();
    serviceCollection.addStatic('logger', log);

    const pgMain = await postgres.main();
    serviceCollection.addStatic('pg', pgMain);

    const pgDS = await postgres.ds();
    serviceCollection.addStatic('ds', pgDS);

    const mail = mailer();
    serviceCollection.addStatic('mail', mail);

    const s3 = bucket();
    serviceCollection.addStatic('s3', s3);

    const cleverClient = clever();
    serviceCollection.addStatic('clever', cleverClient);

    const redisClient = redis();
    serviceCollection.addStatic('redis', redisClient);
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
