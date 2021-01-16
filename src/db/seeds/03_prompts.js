// deno-lint-ignore-file
const seedPrompts = [
  { prompt: 'This is a test prompt.', active: true },
  { prompt: 'This is another test prompt.' },
  { prompt: 'This is a third test prompt.' },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('prompts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('prompts').insert(seedPrompts);
    });
};
