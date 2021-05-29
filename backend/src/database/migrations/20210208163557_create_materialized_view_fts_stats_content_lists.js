const UP = `
CREATE MATERIALIZED VIEW fts_stats_content_lists AS
SELECT q.query, st.*
FROM
  ts_stat($$
    SELECT to_tsvector('simple_unaccent', cl.title) ||
      to_tsvector('simple_unaccent', cl.description)
    FROM content_lists AS cl
  $$) AS st,
  nullif(to_tsquery('portuguese_unaccent',
    quote_literal(st.word)), '') AS q(query)
WHERE q.query IS NOT NULL;

CREATE OR REPLACE FUNCTION fts_stats_content_lists_update_trigger()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW fts_stats_content_lists;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER fts_stats_content_lists_update
AFTER INSERT OR UPDATE ON content_lists
EXECUTE PROCEDURE fts_stats_content_lists_update_trigger();
`;

const DOWN = `
DROP TRIGGER fts_stats_content_lists_update ON content_lists;

DROP FUNCTION fts_stats_content_lists_update_trigger();

DROP MATERIALIZED VIEW fts_stats_content_lists;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
