// deno-lint-ignore-file
const students = [
  { userId: 5, sectionId: 1 },
  { userId: 5, sectionId: 2 },
  { userId: 7, sectionId: 1 },
  { userId: 7, sectionId: 2 },
];

async function seed_clever_students(knex) {
  await knex('clever_students').insert(students);
}

module.exports = { seed_clever_students };
