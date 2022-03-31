const UP = `
CREATE MATERIALIZED VIEW fts_stats_profiles AS
SELECT q.query, st.*
FROM
  ts_stat($$
    SELECT to_tsvector('simple_unaccent', u.name)
    FROM profiles AS u
  $$) AS st,
  nullif(to_tsquery('simple_unaccent',
    quote_literal(st.word)), '') AS q(query)
WHERE q.query IS NOT NULL;

CREATE OR REPLACE FUNCTION fts_stats_profiles_update_trigger()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW fts_stats_profiles;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER fts_stats_profiles_update
AFTER INSERT OR UPDATE ON profiles
EXECUTE PROCEDURE fts_stats_profiles_update_trigger();
`;

const DOWN = `
DROP TRIGGER fts_stats_profiles_update ON profiles;

DROP FUNCTION fts_stats_profiles_update_trigger();

DROP MATERIALIZED VIEW fts_stats_profiles;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
