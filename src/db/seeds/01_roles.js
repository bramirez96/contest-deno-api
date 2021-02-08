// deno-lint-ignore-file
exports.seed = function (knex) {
  return knex('roles').insert([
    { role: 'user' },
    { role: 'teacher' },
    { role: 'admin' },
  ]);
};
