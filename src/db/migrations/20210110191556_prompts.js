// deno-lint-ignore-file
exports.up = (knex) => {
  return knex.schema.createTable('prompts', (t) => {
    t.increments('id');
    t.string('prompt').notNullable().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('prompts');
};
