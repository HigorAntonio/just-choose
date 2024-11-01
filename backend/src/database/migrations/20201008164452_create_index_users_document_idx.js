const UP = `
CREATE INDEX users_document_idx ON users USING GIN (document);
`;

const DOWN = `
DROP INDEX users_document_idx;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
