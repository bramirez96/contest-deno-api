# Story Squad Rest API

This is a refactor of the existing Story Squad API built in Deno.

[Deno Installation Guide](./docs/DenoSetup.md)

[Database Setup Guide](./docs/DBSetup.md)

## Running the Server Locally

There are three options for running the server.

### Option 1: `Denon`

I highly recommend using Denon. It offers two main functionalities that many developers have grown accustomed to from Node development: a file watcher and a script manager. Denon allows you to specify scripts to run in a similar fashion to a Node `package.json` file. Check out the scripts for this project in [`scripts.config.ts`](./scripts.config.ts).

There are two steps to install Denon as a global Bash script:

```bash
# Step 1: Install from deno.land or nest.land
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
# or
deno install -qAf --unstable https://x.nest.land/denon/denon.ts

# Step 2: Add the denon alias to your Bash config
echo 'alias denon="~/.deno/bin/denon.cmd"' >> ~/.bashrc
```

### Option 3: Running Deno Directly

If you don't want the overhead of installing a script runner, you can always run the server with Deno's built-in run script.

```bash
deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/mod.ts start
```

I recommend installing the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to run the server locally. It allows you to use the `Procfile` script to run the server with a simple bash command: `heroku local web`.

If you don't want to install the CLI for whatever reason, you can instead just use the `web` script from the `Procfile` directly in your bash terminal:

```bash
deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/app.ts
```

> Note: currently, this script is allowing all access with the `-A` flag. This WILL be changed later but is just easier for our current needs.
