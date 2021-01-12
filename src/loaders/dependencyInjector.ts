import { serviceCollection } from '../../deps.ts';
import pgConnect from './postgres.ts';
import logger from './logger.ts';

export default async () => {
  try {
    const log = await logger();
    serviceCollection.addStatic('logger', log);

    const pg = await pgConnect();
    serviceCollection.addStatic('pg', pg);
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
