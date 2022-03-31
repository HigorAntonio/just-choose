const UP = `
CREATE INDEX profiles_document_idx ON profiles USING GIN (document);
`;

const DOWN = `
DROP INDEX profiles_document_idx;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
