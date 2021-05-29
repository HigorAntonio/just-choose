const UP = `
CREATE INDEX polls_document_idx ON polls USING GIN (document);
`;

const DOWN = `
DROP INDEX polls_document_idx;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
