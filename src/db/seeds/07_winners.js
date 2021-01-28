// deno-lint-ignore-file
const winner = {
  submissionId: 3,
};

exports.seed = function (knex) {
  return knex('winners').insert(winner);
};
