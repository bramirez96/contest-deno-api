import { serviceCollection } from '../../deps.ts';
import pgConnect from './postgres.ts';
import logger from './logger.ts';
import mailer from './mailer.ts';
import bucket from './bucket.ts';

export default async (loggerName?: string) => {
  try {
    const log = await logger(loggerName);
    serviceCollection.addStatic('logger', log);

    const pg = await pgConnect();
    serviceCollection.addStatic('pg', pg);

    const mail = mailer();
    serviceCollection.addStatic('mail', mail);

    const s3 = bucket();
    serviceCollection.addStatic('s3', s3);
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
