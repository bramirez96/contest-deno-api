// deno-lint-ignore-file
const seedPrompts = [
  { prompt: 'This is a test prompt.' },
  { prompt: 'This is another test prompt.', active: true },
  { prompt: 'This is a third test prompt.' },
  { prompt: 'This is a fourth test prompt.' },
];

async function seed_prompts(knex) {
  await knex('prompts').insert(seedPrompts);
}

module.exports = { seed_prompts };
