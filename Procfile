web: deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/mod.ts start
test: deno test --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json __tests__/
dev: yarn reset && deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/mod.ts start
format: deno fmt --ignore=./node_modules/
lint: deno lint --ignore=./node_modules/