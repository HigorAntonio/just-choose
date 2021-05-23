const UP = `
  CREATE TEXT SEARCH CONFIGURATION simple_unaccent ( COPY = simple );
  ALTER TEXT SEARCH CONFIGURATION simple_unaccent ALTER MAPPING
  FOR hword, hword_part, word WITH unaccent, simple;
`;

const DOWN = `
  DROP TEXT SEARCH CONFIGURATION simple_unaccent;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
