// deno-lint-ignore-file
const today = new Date();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const testPromptQueue = [
  {
    promptId: 1,
    starts_at: twoDaysAgo.toUTCString(),
  },
  {
    promptId: 2,
    starts_at: yesterday.toUTCString(),
  },
  {
    promptId: 3,
    starts_at: today.toUTCString(),
  },
  {
    promptId: 4,
    starts_at: tomorrow.toUTCString(),
  },
];

exports.seed = function (knex) {
  return knex('prompt_queue').insert(testPromptQueue);
};
