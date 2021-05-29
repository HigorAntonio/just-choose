const UP = `
CREATE MATERIALIZED VIEW fts_stats_polls AS
SELECT q.query, st.*
FROM
  ts_stat($$
    SELECT to_tsvector('simple_unaccent', p.title) ||
      to_tsvector('simple_unaccent', p.description)
    FROM polls AS p
  $$) AS st,
  nullif(to_tsquery('portuguese_unaccent',
    quote_literal(st.word)), '') AS q(query)
WHERE q.query IS NOT NULL;

CREATE OR REPLACE FUNCTION fts_stats_polls_update_trigger()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW fts_stats_polls;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER fts_stats_polls_update
AFTER INSERT OR UPDATE ON polls
EXECUTE PROCEDURE fts_stats_polls_update_trigger();
`;

const DOWN = `
DROP TRIGGER fts_stats_polls_update ON polls;

DROP FUNCTION fts_stats_polls_update_trigger();

DROP MATERIALIZED VIEW fts_stats_polls;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
