import {
  DeleteObjectOptions,
  DeleteObjectResponse,
  GetObjectOptions,
  GetObjectResponse,
  PutObjectOptions,
  PutObjectResponse,
  S3Bucket,
  v4,
} from '../../deps.ts';
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
  public putObject(
    key: string,
    body: Uint8Array,
    options?: PutObjectOptions | undefined
  ): PutObjectResponse {
    console.log(key, body, options);
    return {
      etag: v4.generate(),
    };
  }
  public deleteObject(
    key: string,
    options?: DeleteObjectOptions | undefined
  ): DeleteObjectResponse {
    console.log(key, options);
    return {
      deleteMarker: true,
    };
  }
  public getObject(
    key: string,
    options?: GetObjectOptions | undefined
  ): GetObjectResponse {
    console.log(key, options);
    return {
      body: new Uint8Array(),
      contentLength: 5,
      deleteMarker: false,
      etag: v4.generate(),
      lastModified: new Date(),
      missingMeta: 0,
      storageClass: 'STANDARD',
      taggingCount: 0,
    };
  }
}
