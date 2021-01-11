# Story Squad Rest API

This is a refactor of the existing Story Squad API built in Deno.

## Database Setup

Make sure you have Docker installed on your machine, and then run `docker-compose up -d`.

Your databse container should be set up. If there are any error on composition, you'll need to change ports listed in your Docker configuration files, or you can figure out what on your machine is being hosted on ports 5900, 5932, and 5950.

To log in to PGAdmin, open [http://localhost:5950](http://localhost:5950) in your browser. Open the `Servers` group. You should see a server called `SS_Deno-BE`. When you attempt to open the server, it will ask you for a password. The password should be defaulted to `docker` unless you've changed any Docker ENV vars.

## Database Migrations

### New Migration

```bash
deno run --allow-net --allow-read --allow-write --allow-env https://deno.land/x/nessie@1.1.3/cli.ts make <migrationName> -c ./nessie.config.ts
```

### New Seedfile

```bash
deno run --allow-net --allow-read --allow-write --allow-env https://deno.land/x/nessie@1.1.3/cli.ts make:seed <seedName> -c ./nessie.config.ts
```

### Run Migrations

```bash
deno run --allow-net --allow-read --allow-write --allow-env https://deno.land/x/nessie@1.1.3/cli.ts migrate <numberOfMigrations> -c ./nessie.config.ts
```

### Roll Back Migrations

```bash
deno run --allow-net --allow-read --allow-write --allow-env https://deno.land/x/nessie@1.1.3/cli.ts rollback <numberOfMigrations> -c ./nessie.config.ts
```

### Run Seeds

```bash
deno run --allow-net --allow-read --allow-write --allow-env https://deno.land/x/nessie@1.1.3/cli.ts seed -c ./nessie.config.ts
```
