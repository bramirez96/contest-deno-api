// deno-lint-ignore-file
const moment = require('moment');

const testPromptQueue = [
  {
    promptId: 1,
    starts_at: moment.utc().subtract(2, 'd'),
  },
  {
    promptId: 2,
    starts_at: moment.utc().subtract(1, 'd'),
  },
  {
    promptId: 3,
    starts_at: moment.utc(),
  },
  {
    promptId: 4,
    starts_at: moment.utc().add(1, 'd'),
  },
];

async function seed_prompt_queue(knex) {
  await knex('prompt_queue').insert(testPromptQueue);
}

module.exports = { seed_prompt_queue };
