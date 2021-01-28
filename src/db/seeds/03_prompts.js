// deno-lint-ignore-file
const seedPrompts = [
  { prompt: 'This is a test prompt.' },
  { prompt: 'This is another test prompt.', active: true },
  { prompt: 'This is a third test prompt.' },
  { prompt: 'This is a fourth test prompt.' },
];

exports.seed = function (knex) {
  return knex('prompts').insert(seedPrompts);
};
