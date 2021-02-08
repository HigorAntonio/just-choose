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
      table.string('title', 50).notNullable();
      table.text('description');
      table.text('thumbnail');

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw(onUpdateTrigger('polls')));

exports.down = async (knex) => knex.schema.dropTable('polls');
