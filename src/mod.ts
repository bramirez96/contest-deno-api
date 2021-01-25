import 'https://cdn.pika.dev/@abraham/reflection@^0.7.0';
import app from './app.ts';
import env from './config/env.ts';

export async function startServer(): Promise<void> {
  const server = await app();

  server.listen(env.PORT, () => {
    console.log(`== Server listening on port ${env.PORT} ==`);
  });
}

if (Deno.args[0] === 'start') {
  startServer();
}
