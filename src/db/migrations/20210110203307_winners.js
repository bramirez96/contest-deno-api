// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('winners', (t) => {
    t.increments('id');
    t.integer('submissionId')
      .notNullable()
      .unsigned()
      .references('submissions.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.datetime('createdAt', { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('winners');
};
