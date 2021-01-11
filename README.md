# Story Squad Rest API

This is a refactor of the existing Story Squad API built in Deno.

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
