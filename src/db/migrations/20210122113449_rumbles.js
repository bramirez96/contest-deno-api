// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('rumbles', (t) => {
    t.increments('id');
    t.boolean('canJoin').defaultTo(true);
    t.string('joinCode').unique();
    t.integer('numMinutes').notNullable();
    t.integer('maxSections').notNullable().defaultTo(2);
    t.integer('promptId')
      .unsigned()
      .notNullable()
      .references('prompts.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('rumbles');
};
