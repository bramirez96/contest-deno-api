import { S3Bucket } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Connecting to S3...');
  const s3 = new S3Bucket(env.S3_CONFIG);
  console.log('S3 connected!');
  return s3;
};
