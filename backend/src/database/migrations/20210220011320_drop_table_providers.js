const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) => knex.schema.dropTable('providers');

exports.down = async (knex) =>
  knex.schema
    .createTable('providers', (table) => {
      table.increments('id').primary();
      table.integer('jw_id').unique().notNullable();
      table.string('name', 50).unique().notNullable();
      table.string('short_name', 10).unique().notNullable();
      table.text('icon_url').defaultTo(null);

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('providers')));
