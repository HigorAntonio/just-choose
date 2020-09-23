exports.up = async knex => knex.schema.createTable('movie_providers', table => {
  table.increments('id');
  table.integer('movie_id')
    .references('movies.id')
    .notNullable()
    .onUpdate('CASCADE')
    .onDelete('CASCADE');
  table.integer('provider_id')
    .references('providers.id')
    .notNullable()
    .onUpdate('CASCADE')
    .onDelete('CASCADE');

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
  table.timestamp('deleted_at');
});

exports.down = async knex => knex.schema.dropTable('movie_providers');