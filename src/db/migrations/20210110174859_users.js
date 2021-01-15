// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('users', (t) => {
    t.increments('id');
    t.string('codename', 16).notNullable().unique().index();
    t.string('email').notNullable().unique().index();
    t.string('parentEmail').notNullable();
    t.string('password').notNullable();
    t.integer('age').notNullable();
    t.boolean('isValidated').defaultTo(false);
    t.integer('roleId')
      .notNullable()
      .unsigned()
      .references('roles.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.datetime('createdAt', { precision: 6 }).defaultTo(knex.fn.now(6));
    t.datetime('updatedAt', { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
