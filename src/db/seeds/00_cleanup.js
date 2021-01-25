// deno-lint-ignore-file
const cleaner = require('knex-cleaner');

function cleanTables(knex) {
  return cleaner
    .clean(knex, {
      mod: 'truncate',
      restartIdentity: true,
      ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
    })
    .then(() =>
      console.log(`== All tables truncated and ready to be seeded ==`)
    );
}

exports.seed = function (knex) {
  return cleanTables(knex);
};
