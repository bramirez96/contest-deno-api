// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('enum_grades', (t) => {
    t.string('id').notNullable().unique().index().primary();
    t.string('grade', 20).notNullable().unique().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('enum_grades');
};
