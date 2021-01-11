import { serviceCollection } from '../../deps.ts';
import pgConnect from './postgres.ts';

export default async () => {
  try {
    const pg = await pgConnect();
    serviceCollection.addStatic('pg', pg);
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
