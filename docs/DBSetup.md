# Database Setup

Make sure you have Docker installed on your machine, and then run `docker-compose up -d`.

Your databse container should be set up. If there are any error on composition, you'll need to change ports listed in your Docker configuration files, or you can figure out what on your machine is being hosted on ports 5900, 5932, and 5950.

To log in to PGAdmin, open [http://localhost:5950](http://localhost:5950) in your browser. Open the `Servers` group. You should see a server called `SS-Deno-BE`. When you attempt to open the server, it will ask you for a password. The password should be defaulted to `docker` unless you've changed any Docker ENV vars.

## Database Migrations and Seeding

Install the Cotton CLI to run migrations:

```bash
deno install --allow-net --allow-read --allow-write -n cotton https://deno.land/x/cotton@v0.7.5/cli.ts
```

Add the Cotton cmd script to your bash aliases:

Open your `.bashrc` configuration file

```bash
vim ~/.bashrc
```

Press `i` to enter insert mode.

On a new line, add the following snippet:

```bash
alias cotton='~/.deno/bin/cotton.cmd'
```

> This allows you to run Cotton CLI scripts directly from bash just with the `cotton` keyword!
