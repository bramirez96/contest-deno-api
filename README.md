# Story Squad Rest API

This is a refactor of the existing Story Squad API built in Deno.

## Running the Server Locally

I recommend installing the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to run the server locally. It allows you to use the `Procfile` script to run the server with a simple bash command: `heroku local web`.

If you don't want to install the CLI for whatever reason, you can instead just use the `web` script from the `Procfile` directly in your bash terminal:

```bash
deno run -A -c ./tsconfig.json src/app.ts
```

> Note: currently, this script is allowing all access with the `-A` flag. This WILL be changed later but is just easier for our current needs.

## Database Setup

Make sure you have Docker installed on your machine, and then run `docker-compose up -d`.

Your databse container should be set up. If there are any error on composition, you'll need to change ports listed in your Docker configuration files, or you can figure out what on your machine is being hosted on ports 5900, 5932, and 5950.

To log in to PGAdmin, open [http://localhost:5950](http://localhost:5950) in your browser. Open the `Servers` group. You should see a server called `SS_Deno-BE`. When you attempt to open the server, it will ask you for a password. The password should be defaulted to `docker` unless you've changed any Docker ENV vars.

## Database Migrations

Currently, we're using Knex to run our database migrations through Yarn.

```bash
# new migration
yarn make <migrationName>

# new seed file
yarn makeseed <seedName>

# run migrations
yarn latest

# roll back migrations
yarn rollback

# run seeds
yarn seed
```
