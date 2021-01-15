// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('validation', (t) => {
    t.increments('id');
    t.string('code').notNullable().index();
    t.integer('userId')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.datetime('createdAt', { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('validation');
};
