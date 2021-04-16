// deno-lint-ignore-file
const moment = require('moment');

const rumbleSections = [
  { rumbleId: 1, sectionId: 1, end_time: moment.utc().subtract(24, 'h') },
  { rumbleId: 2, sectionId: 1, end_time: moment.utc().subtract(1, 'h') },
  { rumbleId: 3, sectionId: 1 },
];

async function seed_rumble_sections(knex) {
  await knex('rumble_sections').insert(rumbleSections);
}

module.exports = { seed_rumble_sections };
