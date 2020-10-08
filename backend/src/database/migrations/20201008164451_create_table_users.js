const { onUpdateTrigger } = require('../triggers');

exports.up = async knex => knex.schema.createTable('users', table => {
  table.increments('id').primary();
  table.text('profile_image_url');
  table.enu('method', ['local', 'twitch']).notNullable();

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
  table.timestamp('deleted_at');
}).then(() => knex.raw(onUpdateTrigger('users')));

exports.down = async knex => knex.schema.dropTable('users');