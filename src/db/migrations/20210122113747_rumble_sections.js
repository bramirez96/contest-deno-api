// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('rumble_sections', (t) => {
    t.increments('id');
    t.integer('score');
    t.dateTime('endTime').notNullable();
    t.integer('rumbleId')
      .unsigned()
      .notNullable()
      .references('rumbles.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.integer('sectionId')
      .unsigned()
      .notNullable()
      .references('clever_sections.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('rumble_sections');
};
