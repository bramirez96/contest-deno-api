import { config } from '../../deps.ts';

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
};
