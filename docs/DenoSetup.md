# Setting Up Deno

This guide is for installing Deno in Git Bash on Windows.

## Install Deno

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

## Configure Bash

After installation, run the following commands.

> This command will generate a file structure to allow you to add autocompletion for different bash scripts

```bash
mkdir ~/.etc && mkdir ~/.etc/bash_completion.d
```

> This command generates a file for Deno autocompletion

```bash
deno completions bash > ~/.etc/bash_completion.d/deno.bash
```

> This command will create a bash configuration file that allows you to easily add Deno onto your path (giving you the option to run the `deno` command straight from bash) as well as adding the Deno autocomplete scripts to your configuration

```bash
echo $'export DENO_INSTALL="/$HOME/.deno"\nexport PATH="$DENO_INSTALL/bin:$PATH"\nsource ~/.etc/bash_completion.d/deno.bash' > ~/.bashrc
```

At this point, you will likely have to restart your machine for your bash configuration to take effect.

### Test Your Deno Install

First, run `deno --version` to check the status of your install. If it correctly returns your version information, then you can try to run the following example code:

```bash
deno run --allow-net=example.com https://deno.land/std@0.83.0/examples/curl.ts https://example.com
```

> `run` is the Deno command for running a script file. The `--allow-net` flag grants Deno access to your network connection. The first URL links to the script you will be running, which is a Deno example script. The second URL is the URL of the website you will be fetching. If the script runs correctly, it should print HTML code to your console.

## Configure VSCode

All it takes to setup VS Code for Deno is to install the [extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) from the extensions marketplace.
