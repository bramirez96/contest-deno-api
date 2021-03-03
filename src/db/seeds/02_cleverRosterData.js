// deno-lint-ignore-file
const { seed_clever_sections } = require('./seedFiles/13_clever_sections');
const { seed_clever_teachers } = require('./seedFiles/14_clever_teachers');
const { seed_clever_students } = require('./seedFiles/15_clever_students');

exports.seed = async function (knex) {
  await seed_clever_sections(knex);
  await seed_clever_teachers(knex);
  await seed_clever_students(knex);
};
