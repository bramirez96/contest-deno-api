# Story Squad Rest API

This is a refactor of the existing Story Squad API built in Deno.

[Deno Installation Guide](./docs/DenoSetup.md)

[Database Setup Guide](./docs/DBSetup.md)

## Running the Server Locally

I recommend installing the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to run the server locally. It allows you to use the `Procfile` script to run the server with a simple bash command: `heroku local web`.

If you don't want to install the CLI for whatever reason, you can instead just use the `web` script from the `Procfile` directly in your bash terminal:

```bash
deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/app.ts
```

> Note: currently, this script is allowing all access with the `-A` flag. This WILL be changed later but is just easier for our current needs.
