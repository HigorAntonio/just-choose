const UP = `
CREATE OR REPLACE FUNCTION users_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.document := to_tsvector('simple_unaccent', NEW.name);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER users_tsvector_update
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE users_tsvector_trigger();
`;

const DOWN = `
DROP TRIGGER users_tsvector_update ON users;

DROP FUNCTION users_tsvector_trigger();
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
