// deno-lint-ignore-file
const top3 = [{ submissionId: 1 }, { submissionId: 2 }, { submissionId: 3 }];

exports.seed = function (knex) {
  return knex('top3').insert(top3);
};
