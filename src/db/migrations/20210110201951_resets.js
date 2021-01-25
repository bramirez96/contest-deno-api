// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('resets', (t) => {
    t.increments('id');
    t.boolean('completed').notNullable().defaultTo(false);
    t.string('code').notNullable().index();
    t.integer('userId')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.datetime('createdAt').defaultTo(knex.raw("(now() at time zone 'utc')"));
    t.datetime('expiresAt').defaultTo(
      knex.raw(`? + INTERVAL '? day'`, [
        knex.raw("(now() at time zone 'utc')"),
        1,
      ])
    );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('resets');
};
