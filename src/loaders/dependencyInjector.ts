import { serviceCollection } from '../../deps.ts';
import pgConnect from './postgres.ts';
import logger from './logger.ts';
import mailer from './mailer.ts';
import bucket from './bucket.ts';
import clever from './clever.ts';

export default async () => {
  try {
    const log = await logger();
    serviceCollection.addStatic('logger', log);

    const pg = await pgConnect();
    serviceCollection.addStatic('pg', pg);

    const mail = mailer();
    serviceCollection.addStatic('mail', mail);

    const s3 = bucket();
    serviceCollection.addStatic('s3', s3);

    const cleverClient = clever();
    serviceCollection.addStatic('clever', cleverClient);
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
