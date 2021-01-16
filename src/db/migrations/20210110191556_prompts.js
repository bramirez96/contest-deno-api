// deno-lint-ignore-file
exports.up = (knex) => {
  return knex.schema.createTable('prompts', (t) => {
    t.increments('id');
    t.string('prompt').notNullable().unique();
    t.boolean('active').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('prompts');
};
