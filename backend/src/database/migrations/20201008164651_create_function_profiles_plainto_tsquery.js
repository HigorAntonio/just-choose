const UP = `
CREATE OR REPLACE FUNCTION public.profiles_plainto_tsquery(source text)
RETURNS tsquery
LANGUAGE sql
IMMUTABLE
AS $function$
	SELECT string_agg('(' || query || ')', ' & ')::tsquery
	FROM
    unnest(to_tsvector('simple_unaccent', source)) AS usr
    CROSS JOIN LATERAL (
      SELECT lexeme, string_agg(quote_literal(word), ' | ') query
      FROM (
        SELECT lexeme, word
        FROM
          (VALUES(source)) AS input(source),
          fts_stats_profiles s
        WHERE
          s.word % usr.lexeme
        ORDER BY s.word <-> usr.lexeme
        LIMIT 50
    ) AS q
    GROUP BY lexeme
	) AS w;
$function$
`;

const DOWN = `
DROP FUNCTION public.profiles_plainto_tsquery(source text);
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
