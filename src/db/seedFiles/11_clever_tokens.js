// deno-lint-ignore-file
const sso_lookups = [
  { accessToken: '6001e942790e5a0fd643d7ea', providerId: 1, userId: 4 },
  { accessToken: '6001e942790e5a0fd643d7c5', providerId: 1, userId: 5 },
];

async function seed_clever_tokens(knex) {
  await knex('sso_lookup').insert(sso_lookups);
}

module.exports = { seed_clever_tokens };
