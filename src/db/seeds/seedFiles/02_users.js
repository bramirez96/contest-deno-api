// deno-lint-ignore-file
const seedUsers = [
  {
    codename: 'A Codename',
    email: 'anemail@email.com',
    firstname: 'Firstname',
    lastname: 'Lastname',
    password: 'thisisastringyoucanteverlogin',
    isValidated: true,
    roleId: 1,
  },
  {
    codename: 'CodenameTwo',
    email: 'anemawwww@email.com',
    firstname: 'Firstname',
    lastname: 'Lastname',
    password: 'thisisastringyoucanteverloginuhoh',
    isValidated: true,
    roleId: 2,
  },
  {
    codename: 'CodenameThree',
    email: 'email@email.com',
    firstname: 'Firstname3',
    lastname: 'Lastname3',
    password: '$2a$10$cZajEDkFrgEsdEbVYed4IeM6RAy75/FV9KRlJDZ63O1Cc0KNp13tG', // somepass123A
    isValidated: true,
    roleId: 3,
  },
  {
    codename: 'TeacherSuccess',
    email: 'conn_reuben@example.net',
    firstname: 'Reuben',
    lastname: 'Conn',
    password: '$2a$10$cZajEDkFrgEsdEbVYed4IeM6RAy75/FV9KRlJDZ63O1Cc0KNp13tG', // somepass123A
    isValidated: true,
    roleId: 2,
  },
  {
    codename: 'StudentSuccess',
    email: 'f.young@example.net',
    firstname: 'Fahey',
    lastname: 'Young',
    password: '$2a$10$cZajEDkFrgEsdEbVYed4IeM6RAy75/FV9KRlJDZ63O1Cc0KNp13tG', // somepass123A
    isValidated: true,
    roleId: 1,
  },
  {
    codename: 'TeacherMerge',
    email: 'daniel.casandra@example.net',
    firstname: 'Casandra',
    lastname: 'Daniel',
    password: '$2a$10$cZajEDkFrgEsdEbVYed4IeM6RAy75/FV9KRlJDZ63O1Cc0KNp13tG', // somepass123A
    isValidated: true,
    roleId: 2,
  },
];

async function seed_users(knex) {
  await knex('users').insert(seedUsers);
}

module.exports = { seed_users };
