const UP = `
CREATE OR REPLACE FUNCTION public.polls_plainto_tsquery(source text)
RETURNS tsquery
LANGUAGE sql
IMMUTABLE
AS $function$
	SELECT
    string_agg('(' || queries.query_source::text || '|' || queries.queries_or || ')', ' & ')::tsquery AS query
  FROM
    unnest(to_tsvector('simple_unaccent', source)) AS usr
  CROSS JOIN LATERAL(
    SELECT
      to_tsquery('portuguese_unaccent', quote_literal(usr.lexeme)) AS query_source,
      string_agg(matches.query::text, ' | ') AS queries_or
    FROM (
      SELECT
        s.*, similarity(s.word, usr.lexeme)
      FROM
        fts_stats_polls s
      WHERE
        s.word % usr.lexeme
      ORDER BY s.word <-> usr.lexeme
      LIMIT 50
    ) AS matches
  ) AS queries;
$function$
`;

const DOWN = `
DROP FUNCTION public.polls_plainto_tsquery(source text);
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
