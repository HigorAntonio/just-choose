const UP = `
CREATE INDEX content_lists_document_idx ON content_lists USING GIN (document);
`;

const DOWN = `
DROP INDEX content_lists_document_idx;
`;

exports.up = async (knex) => knex.raw(UP);
exports.down = async (knex) => knex.raw(DOWN);
