const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('content_lists', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('users.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.text('title').notNullable();
      table.text('description');
      table
        .enu('sharing_option', ['private', 'public', 'followed_profiles'])
        .notNullable()
        .defaultTo('private');
      table.text('thumbnail').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() =>
      knex.raw('ALTER TABLE content_lists ADD COLUMN document tsvector;')
    )
    .then(() => knex.raw(onUpdateTrigger('content_lists')));

exports.down = async (knex) => knex.schema.dropTable('content_lists');
