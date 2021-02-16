# Setting Up Deno

## Installing Deno

View the online installation guide [here](https://deno.land/manual/getting_started/installation), or run the following script:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

### Configure Bash (Windows, Git Bash)

After installation, run the following commands.

This command will create a bash configuration file that allows you to easily add Deno onto your path (giving you the option to run the `deno` command straight from bash) as well as adding Deno to your path.

```bash
echo 'export PATH=$HOME/.deno/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
source ~/.bash_profile
```

**_At this point, you will likely have to restart your machine or at least your Bash instance for your new configuration to take effect._**

This command will generate a file structure to allow you to add autocompletion for different bash scripts

```bash
mkdir ~/.etc && mkdir ~/.etc/bash_completion.d
```

This command generates a file for Deno autocompletion

```bash
deno completions bash > ~/.etc/bash_completion.d/deno.bash
```

This command adds the newly-generated completions script to your Bash configuration

```bash
echo "source ~/.etc/bash_completion.d/deno.bash" >> ~/.bashrc
```

### Configure ZShell (Mac)

After installation, run the following commands.

This command will create a bash configuration file that allows you to easily add Deno onto your path (giving you the option to run the `deno` command straight from bash) as well as adding Deno to your path.

```bash
echo 'export PATH=$HOME/.deno/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

**_At this point, you will likely have to restart your machine or at least your Bash instance for your new configuration to take effect._**

This command will generate a file structure to allow you to add autocompletion for different bash scripts

```bash
mkdir ~/.zsh
```

This command generates a file for Deno autocompletion

```bash
deno completions zsh > ~/.zsh/_deno
```

This command adds the newly-generated completions script to your Bash configuration

```bash
echo "fpath=(~/.zsh $fpath)\nautoload -Uz compinit\ncompinit -u" >> ~/.zshrc
source ~/.zshrc
```

### Test Your Deno Install

First, run `deno --version` to check the status of your install. If it correctly returns your version information, then you can try to run the following example code:

```bash
deno run --allow-net=example.com https://deno.land/std@0.83.0/examples/curl.ts https://example.com
```

> `run` is the Deno command for running a script file. The `--allow-net` flag grants Deno access to your network connection. The first URL links to the script you will be running, which is a Deno example script. The second URL is the URL of the website you will be fetching. If the script runs correctly, it should print HTML code to your console.

## Configure VSCode

All it takes to setup VS Code for Deno is to install the [extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) from the extensions marketplace.

I also recommend you to install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions, as this workspaces utilizes them heavily.

**_It is higly recommended to reset your VSCode instance after following these instructions!_** If you are still recieving errors, try restarting your computer. As a last step, please reach out to a project manager for assistance.
