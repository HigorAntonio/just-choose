const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('polls', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('users.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.text('title').notNullable();
      table.text('description');
      table.boolean('is_active').notNullable().defaultTo(false);
      table
        .enu('sharing_option', ['private', 'public', 'followed_profiles'])
        .notNullable()
        .defaultTo('private');
      table.text('thumbnail').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('polls')));

exports.down = async (knex) => knex.schema.dropTable('polls');
