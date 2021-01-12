// deno-lint-ignore-file
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          codename: 'A Codename',
          email: 'anemail@email.com',
          parentEmail: 'anEmail@email.com',
          password: 'thisisastringyoucanteverlogin',
          age: 24,
          roleId: 1,
        },
        {
          codename: 'CodenameTwo',
          email: 'anemawwww@email.com',
          parentEmail: 'anEmawwww@email.com',
          password: 'thisisastringyoucanteverloginuhoh',
          age: 22,
          roleId: 2,
        },
      ]);
    });
};
