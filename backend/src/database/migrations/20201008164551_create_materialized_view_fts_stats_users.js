const UP = `
CREATE MATERIALIZED VIEW fts_stats_users AS
SELECT q.query, st.*
FROM
  ts_stat($$
    SELECT to_tsvector('simple_unaccent', u.name)
    FROM users AS u
  $$) AS st,
  nullif(to_tsquery('simple_unaccent',
    quote_literal(st.word)), '') AS q(query)
WHERE q.query IS NOT NULL;

CREATE OR REPLACE FUNCTION fts_stats_users_update_trigger()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW fts_stats_users;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER fts_stats_users_update
AFTER INSERT OR UPDATE ON users
EXECUTE PROCEDURE fts_stats_users_update_trigger();
`;

const DOWN = `
DROP TRIGGER fts_stats_users_update ON users;

DROP FUNCTION fts_stats_users_update_trigger();

DROP MATERIALIZED VIEW fts_stats_users;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
