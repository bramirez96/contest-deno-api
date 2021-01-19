// deno-lint-ignore-file
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const testPromptQueue = [
  {
    promptId: 2,
    startDate: today.toUTCString(),
  },
  {
    promptId: 3,
    startDate: tomorrow.toUTCString(),
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
