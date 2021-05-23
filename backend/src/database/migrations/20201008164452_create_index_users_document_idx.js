const CREATE_INDEX = `
CREATE INDEX users_document_idx ON users USING GIN (document);
`;

const DROP_INDEX = `
DROP INDEX users_document_idx;
`;

exports.up = async (knex) => knex.raw(CREATE_INDEX);
exports.down = async (knex) => knex.raw(DROP_INDEX);
