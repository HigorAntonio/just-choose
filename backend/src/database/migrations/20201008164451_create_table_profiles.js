const { onUpdateTrigger } = require('../triggers');

exports.up = async (knex) =>
  knex.schema
    .createTable('profiles', (table) => {
      table.increments('id').primary();
      table.text('name').unique().notNullable(); //TODO: O nome de usúario deve ter entre 4 e 25 caracteres
      table.text('display_name').unique().notNullable();
      table.text('email').unique().notNullable();
      table.text('about');
      table.text('profile_image_url');
      table.enu('method', ['local', 'twitch']).notNullable();
      table.boolean('is_active').notNullable().defaultTo(false);

      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
    })
    .then(() => knex.raw('ALTER TABLE profiles ADD COLUMN document tsvector;'))
    .then(() => knex.raw(onUpdateTrigger('profiles')));

exports.down = async (knex) => knex.schema.dropTable('profiles');
