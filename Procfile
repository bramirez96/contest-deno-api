start: deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/mod.ts start
test: cross-env DENO_ENV=testing deno test --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json __tests__/index.test.ts
dev: yarn reset && deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/mod.ts start
format: deno fmt --ignore=./node_modules/
lint: deno lint --ignore=./node_modules/