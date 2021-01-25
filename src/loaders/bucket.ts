import { S3Bucket, v4 } from '../../deps.ts';
import env from '../config/env.ts';

export default () => {
  console.log('Connecting to S3...');

  let s3;
  if (env.DENO_ENV === 'testing') {
    s3 = new TestS3Bucket();
    console.log('Test S3 connected!');
  } else {
    s3 = new S3Bucket(env.S3_CONFIG);
    console.log('S3 connected!');
  }
  return s3;
};

class TestS3Bucket {
  public upload(buffer: Uint8Array, extension?: string) {
    return v4.generate();
  }
}
