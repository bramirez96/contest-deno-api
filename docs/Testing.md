# Testing

You need to install cross-env to run the scripts.

```bash
deno install -f --allow-run --allow-env https://deno.land/x/cross_env@v0.4.0/cross-env.ts
```

Then, run `heroku local test` or `denon test`.

If you've opted for manual script running over the script runners I just mentioned, run the `test` script located in the [Procfile](../Procfile).
