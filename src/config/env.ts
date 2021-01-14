import { config, Algorithm } from '../../deps.ts';

config();

export default {
  PORT: parseInt(Deno.env.get('PORT') || '8000', 10),
  DB_URL: Deno.env.get('DB_URL'),
  DB_CONFIG: {
    database: Deno.env.get('DB_NAME') || '',
    hostname: Deno.env.get('DB_HOST') || '',
    port: parseInt(Deno.env.get('DB_PORT') || '0', 10),
    user: Deno.env.get('DB_USER') || '',
    password: Deno.env.get('DB_PASS') || '',
  },
  SES_CONFIG: {
    credentials: {
      accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey: Deno.env.get('AWS_SECRET_KEY') || '',
    },
    region: Deno.env.get('S3_REGION') || '',
  },
  S3_CONFIG: {
    accessKeyID: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
    secretKey: Deno.env.get('AWS_SECRET_KEY') || '',
    bucket: Deno.env.get('S3_BUCKET') || '',
    region: Deno.env.get('S3_REGION') || '',
  },
  JWT: {
    SECRET: Deno.env.get('JWT_SECRET') || '',
    ALGO: (Deno.env.get('JWT_ALGORITHM') as Algorithm) || 'HS512',
  },
};
