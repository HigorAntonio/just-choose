exports.up = async knex => knex.schema.createTable('providers', table => {
  table.increments('id');
  table.text('name').unique().notNullable();
  table.text('short_name').unique().notNullable();
  table.text('icon_url');

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
  table.timestamp('deleted_at');
});

exports.down = async knex => knex.schema.dropTable('providers');