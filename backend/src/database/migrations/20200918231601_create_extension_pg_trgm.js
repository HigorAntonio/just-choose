const UP = `
  CREATE EXTENSION pg_trgm;
`;

const DOWN = `
  DROP EXTENSION pg_trgm;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
