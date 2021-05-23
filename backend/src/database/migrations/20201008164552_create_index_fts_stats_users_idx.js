const CREATE_INDEX = `
CREATE INDEX fts_stats_users_idx ON fts_stats_users USING GIN (word gin_trgm_ops);
`;

const DROP_INDEX = `
DROP INDEX fts_stats_users_idx;
`;

exports.up = async (knex) => knex.raw(CREATE_INDEX);
exports.down = async (knex) => knex.raw(DROP_INDEX);
