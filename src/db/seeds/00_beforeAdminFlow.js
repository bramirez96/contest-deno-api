// deno-lint-ignore-file
const { seed_cleanup } = require('./seedFiles/00_cleanup');
const { seed_roles } = require('./seedFiles/01_roles');
const { seed_users } = require('./seedFiles/02_users');
const { seed_prompts } = require('./seedFiles/03_prompts');
const { seed_prompt_queue } = require('./seedFiles/04_prompt_queue');
const { seed_submissions } = require('./seedFiles/05_submissions');

exports.seed = async function (knex) {
  await seed_cleanup(knex);
  await seed_roles(knex);
  await seed_users(knex);
  await seed_prompts(knex);
  await seed_prompt_queue(knex);
  await seed_submissions(knex);
};
