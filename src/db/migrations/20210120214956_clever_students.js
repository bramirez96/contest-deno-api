// deno-lint-ignore-file
exports.up = function (knex) {
  return knex.schema.createTable('clever_students', (t) => {
    t.increments('id');
    t.integer('userId')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.integer('sectionId')
      .unsigned()
      .notNullable()
      .references('clever_sections.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    t.string('gradeId')
      .references('enum_grades.id')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('clever_students');
};
