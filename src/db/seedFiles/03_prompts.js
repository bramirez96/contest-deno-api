// deno-lint-ignore-file
const seedPrompts = [
  { prompt: 'This is a past test prompt.' },
  { prompt: 'This is a current test prompt.', active: true },
  { prompt: 'This is a third and future test prompt.' },
  { prompt: 'This is a fourth and future test prompt.' },
];

async function seed_prompts(knex) {
  await knex('prompts').insert(seedPrompts);
}

module.exports = { seed_prompts };
