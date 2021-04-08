FROM python:3

FROM hayd/deno:1.8.1
EXPOSE 8000
COPY --from=0 . ./py
ENV PATH=$PATH:py/usr/local/sbin:~/py/usr/local/bin:~/py/usr/sbin:~/py/usr/bin:~/py/sbin:~/py/bin
RUN apt-get install libpython3.9.so.1.0
WORKDIR /app
COPY deps.ts .
RUN deno cache --unstable deps.ts
ADD . .
RUN deno cache --unstable src/mod.ts
CMD ["deno", "run", "-A", "--unstable", "-c", "./tsconfig.json", "src/mod.ts", "start"]
