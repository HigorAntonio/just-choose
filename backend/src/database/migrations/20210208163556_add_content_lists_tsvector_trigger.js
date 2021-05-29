const UP = `
CREATE OR REPLACE FUNCTION content_lists_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.document := setweight(to_tsvector('portuguese_unaccent', NEW.title), 'A') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER content_lists_tsvector_update
BEFORE INSERT OR UPDATE ON content_lists
FOR EACH ROW
EXECUTE PROCEDURE content_lists_tsvector_trigger();
`;

const DOWN = `
DROP TRIGGER content_lists_tsvector_update ON content_lists;

DROP FUNCTION content_lists_tsvector_trigger();
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
