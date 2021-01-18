// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('votes', (t) => {
    t.increments('id');
    t.integer('userId')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.integer('firstPlace')
      .notNullable()
      .unsigned()
      .references('submissions.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.integer('secondPlace')
      .notNullable()
      .unsigned()
      .references('submissions.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.integer('thirdPlace')
      .notNullable()
      .unsigned()
      .references('submissions.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.datetime('createdAt').defaultTo(knex.raw("(now() at time zone 'utc')"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('votes');
};
