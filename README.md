# Story Squad Rest API

This is a refactor of the existing Story Squad API built in Deno.

[Deno Installation Guide](./docs/DenoSetup.md)

[Database Setup Guide](./docs/DBSetup.md)

## Running the Server Locally

Here are three options for running the server. There are almost certainly other options, but these are the easiest and most practical that I've found.

### Option 1: `Denon`

> **_Note:_** This MIGHT only work in Windows, as I have yet to see it work on Mac.  
> **_Note 2:_** At the time of updating this documentation, there is currently a BREAKING bug in the Denon package and not much we can do to fix it. If you encounter an error on installation, please refer to options 2 or 3 instead.

I highly recommend using Denon. It offers two main functionalities that many developers have grown accustomed to from Node development: a file watcher and a script manager. Denon allows you to specify scripts to run in a similar fashion to a Node `package.json` file. Check out the scripts for this project in [`scripts.config.ts`](./scripts.config.ts).

There are two steps to install Denon as a global Bash script:

```bash
# Step 1: Install from deno.land
deno install -qAf --unstable --reload https://deno.land/x/denon@2.4.6/denon.ts

# Step 2: Add the denon alias to your shell config
# FOR BASH:
echo 'alias denon="~/.deno/bin/denon.cmd"' >> ~/.bashrc

# FOR ZSH:
echo 'alias denon="~/.deno/bin/denon"' >> ~/.zshrc
```

### Option 2: The Heroku CLI

The Heroku CLI is a decent solution to run your application locally. The [Procfile](./Procfile) contains a list of scripts used to run various aspects of the project. Follow the [documentation from Heroku](https://devcenter.heroku.com/articles/heroku-cli) to install the CLI.

To run the [Procfile](./Procfile) scripts, simply use the `heroku local <scriptname>` command with the name of the script you'd like to run:

```bash
heroku local start # runs the server
heroku local test # runs the tests
heroku local dev # resets and seeds the database, then runs the server
```

### Option 3: Running Deno Directly

If you don't want the overhead of installing a script runner, you can always run the server with Deno's built-in run script.

```bash
deno run --allow-net --allow-env --allow-read --unstable --watch -c ./tsconfig.json src/mod.ts start
```

If you'd like to run the server NOT in watch mode, remove the `--watch` flag:

```bash
deno run --allow-net --allow-env --allow-read --unstable -c ./tsconfig.json src/mod.ts start
```
