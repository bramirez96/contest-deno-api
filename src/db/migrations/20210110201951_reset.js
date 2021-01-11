// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('reset', (t) => {
    t.increments('id');
    t.boolean('completed').notNullable().defaultTo(false);
    t.string('code').notNullable().index();
    t.integer('userId')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.datetime('createdAt', { precision: 6 }).defaultTo(knex.fn.now(6));
    t.datetime('expiresAt', { precision: 6 }).defaultTo(
      knex.raw(`? + INTERVAL '? day'`, [knex.fn.now(6), 1])
    );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('reset');
};
