const USER_TSVECTOR_TRIGGER = `
CREATE OR REPLACE FUNCTION user_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.document := to_tsvector('simple_unaccent', NEW.name);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tsvectorupdate
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE user_tsvector_trigger();
`;

const DROP_USER_TSVECTOR_TRIGGER = `
DROP TRIGGER tsvectorupdate ON users;

DROP FUNCTION user_tsvector_trigger();
`;

exports.up = async (knex) => knex.raw(USER_TSVECTOR_TRIGGER);
exports.down = async (knex) => knex.raw(DROP_USER_TSVECTOR_TRIGGER);
