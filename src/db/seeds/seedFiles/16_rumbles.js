// deno-lint-ignore-file
const rumbles = [
  { joinCode: 'somejoinCode', numMinutes: 60, promptId: 1 },
  { joinCode: 'somejoinCode123', numMinutes: 60, promptId: 2 },
];

async function seed_rumbles(knex) {
  await knex('rumbles').insert(rumbles);
}

module.exports = { seed_rumbles };
