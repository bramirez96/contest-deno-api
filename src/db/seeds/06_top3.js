// deno-lint-ignore-file
const top3 = [{ submissionId: 4 }, { submissionId: 5 }, { submissionId: 6 }];

exports.seed = function (knex) {
  return knex('top3').insert(top3);
};
