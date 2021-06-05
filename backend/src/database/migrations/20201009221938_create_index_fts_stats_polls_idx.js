const UP = `
CREATE INDEX fts_stats_polls_idx
ON fts_stats_polls USING GIN (word gin_trgm_ops);
`;

const DOWN = `
DROP INDEX fts_stats_polls_idx;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);