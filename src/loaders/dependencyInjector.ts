import { serviceCollection } from '../../deps.ts';
import pgConnect from './postgres.ts';
import logger from './logger.ts';

export default async () => {
  try {
    const pg = await pgConnect();
    serviceCollection.addStatic('pg', pg);

    const log = await logger();
    serviceCollection.addStatic('logger', log);
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
