# Database Setup

Make sure you have Docker installed on your machine, and then run `docker-compose up -d`.

Your database container should be set up. If there are any error on composition, you'll need to change ports listed in your Docker configuration files, or you can figure out what on your machine is being hosted on the ports we're attempting to us.

To log in to PGAdmin, open [http://localhost:5950](http://localhost:5950) in your browser. Open the `Servers` group. You should see a server called `SS-Deno-BE`. When you attempt to open the server, it will ask you for a password. The password should be defaulted to `docker` unless you've changed any Docker ENV vars. You should see 4 databases: `ss-deno-be`, `ss-deno-test`, `postgres`, and `docker`.

## Known Error

**IF YOU LOG IN TO PGADMIN AND YOU ONLY SEE 2 DATABASES IN THE SERVER:**

1. run `docker-compose down`
2. delete the repo (sorry, you have to)
3. run `git config --global core.autocrlf input`
4. re-clone the repo
5. run `docker-compose up -d`

If this doesn't fix the issue, feel free to reach out to a project manager for assistance.

## Database Migrations and Seeding

To handle our database migrations, we're using a Node shell around the application. The currently existing database migration tools for Deno have bugged imports and cause crashes on run. Eventually, we'd like to use the but for now we're using Knex.

For initial databse setup, you need only run the following:

```bash
yarn latest
yarn seed
yarn latest:test
```

You should likely be familiar with our Knex setup. There are scripts in place in our [`package.json`](./../package.json) file to handle all of our database operations:

```bash
yarn latest # Migrate up until the latest point

yarn rollback # Roll back the previous batch of migrations

yarn seed # Run the existing seed files

yarn reset # Great for development, will rollback, migrate, and seed the database
```

We also have scripts in place to run operations on the testing database. To run those, simply appeny `:test` to the above scripts:

```bash
yarn latest:test
yarn rollback:test
yarn seed:test
yarn reset:test
```
