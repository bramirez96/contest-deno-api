import { redisConnect } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Loading Redis client...');

  let redis;
  try {
    if (env.DENO_ENV === 'testing') {
      redis = redisConnect(env.REDIS_CONFIG);
    } else {
      redis = redisConnect(env.REDIS_CONFIG);
    }
  } catch (err) {
    console.log('Could not connect to Redis', err);
  }

  return redis;
};
