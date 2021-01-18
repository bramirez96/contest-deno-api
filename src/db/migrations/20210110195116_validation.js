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
      .onDelete('CASCADE');
    t.datetime('createdAt').defaultTo(knex.raw("(now() at time zone 'utc')"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('validation');
};
