exports.up = async knex => knex.schema.createTable('movies', table => {
  table.increments('id');
  table.text('tmdb_id').unique().notNullable();
  table.text('title').unique().notNullable();


  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
  table.timestamp('deleted_at');
});

exports.down = async knex => knex.schema.dropTable('movies');