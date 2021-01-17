// deno-lint-ignore-file
exports.up = (knex) => {
  return knex.schema.createTable('submissions', (t) => {
    t.increments('id');
    t.string('s3Label').notNullable().index();
    t.string('etag').notNullable().index();
    t.string('transcription');
    t.integer('confidence');
    t.integer('dsScore');
    t.integer('rotation').defaultTo(0);
    t.integer('userId')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.integer('promptId')
      .notNullable()
      .unsigned()
      .references('prompts.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.datetime('createdAt').defaultTo(knex.raw("(now() at time zone 'utc')"));
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('submissions');
};
