FROM hayd/deno:1.8.1

EXPOSE 8000

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache --unstable deps.ts

ADD . .

RUN deno cache --unstable src/mod.ts

CMD ["run", "-A", "--unstable", "-c", "./tsconfig.json", "src/mod.ts", "start"]