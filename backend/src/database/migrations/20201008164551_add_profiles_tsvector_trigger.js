const UP = `
CREATE OR REPLACE FUNCTION profiles_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.document := to_tsvector('simple_unaccent', NEW.name);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER profiles_tsvector_update
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE profiles_tsvector_trigger();
`;

const DOWN = `
DROP TRIGGER profiles_tsvector_update ON profiles;

DROP FUNCTION profiles_tsvector_trigger();
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
