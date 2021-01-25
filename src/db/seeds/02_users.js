// deno-lint-ignore-file
const seedUsers = [
  {
    codename: 'A Codename',
    email: 'anemail@email.com',
    firstname: 'Firstname',
    lastname: 'Lastname',
    password: 'thisisastringyoucanteverlogin',
    roleId: 1,
  },
  {
    codename: 'CodenameTwo',
    email: 'anemawwww@email.com',
    firstname: 'Firstname',
    lastname: 'Lastname',
    password: 'thisisastringyoucanteverloginuhoh',
    roleId: 2,
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(seedUsers);
    });
};
