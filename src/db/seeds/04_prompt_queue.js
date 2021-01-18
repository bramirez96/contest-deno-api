// deno-lint-ignore-file
const testPromptQueue = [
  {
    promptId: 2,
    startDate: new Date().toUTCString(),
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('prompt_queue')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('prompt_queue').insert(testPromptQueue);
    });
};
