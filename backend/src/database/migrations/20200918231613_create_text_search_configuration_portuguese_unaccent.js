const UP = `
  CREATE TEXT SEARCH CONFIGURATION portuguese_unaccent ( COPY = portuguese );
  ALTER TEXT SEARCH CONFIGURATION portuguese_unaccent ALTER MAPPING
  FOR hword, hword_part, word WITH unaccent, portuguese_stem;
`;

const DOWN = `
  DROP TEXT SEARCH CONFIGURATION portuguese_unaccent;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
