// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('enum_subjects', (t) => {
    t.string('id').notNullable().unique().index().primary();
    t.string('subject', 20).notNullable().unique().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('enum_subjects');
};
