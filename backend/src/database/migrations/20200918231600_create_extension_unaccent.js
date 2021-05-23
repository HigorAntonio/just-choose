const UP = `
  CREATE EXTENSION unaccent;
`;

const DOWN = `
  DROP EXTENSION unaccent;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
