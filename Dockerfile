FROM schwaaweb/deno-python-test-00:20210409-1529

EXPOSE 8000

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache --unstable deps.ts

ADD . .

RUN deno cache --unstable src/mod.ts

CMD ["deno", "run", "-A", "--unstable", "-c", "./tsconfig.json", "src/mod.ts", "start"]
