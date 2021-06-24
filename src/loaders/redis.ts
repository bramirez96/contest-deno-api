import { redisConnect } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Loading Redis client...');

  let redis;
  if (!env.REDIS_CONFIG.hostname && !env.REDIS_CONFIG.port) {
    console.log('Redis is not configured in your environment');
    redis = {};
  } else if (env.DENO_ENV === 'testing') {
    redis = redisConnect(env.REDIS_CONFIG);
  } else {
    redis = redisConnect(env.REDIS_CONFIG);
  }

  return redis;
};
