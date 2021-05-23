const { onUpdateTrigger } = require('../triggers');

const addDocumentTsvector = `
  ALTER TABLE users
  ADD COLUMN document tsvector;
`;

exports.up = async (knex) =>
  knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.text('name').unique().notNullable();
      table.text('email').unique().notNullable();
      table.text('profile_image_url');
      table.enu('method', ['local', 'twitch']).notNullable();
      table.boolean('is_active').notNullable().defaultTo(false);

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('users')))
    .then(() => knex.raw(addDocumentTsvector));

exports.down = async (knex) => knex.schema.dropTable('users');
