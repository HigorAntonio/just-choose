const UP = `
CREATE OR REPLACE FUNCTION polls_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.document := setweight(to_tsvector('portuguese_unaccent', NEW.title), 'A') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER polls_tsvector_update
BEFORE INSERT OR UPDATE ON polls
FOR EACH ROW
EXECUTE PROCEDURE polls_tsvector_trigger();
`;

const DOWN = `
DROP TRIGGER polls_tsvector_update ON polls;

DROP FUNCTION polls_tsvector_trigger();
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
