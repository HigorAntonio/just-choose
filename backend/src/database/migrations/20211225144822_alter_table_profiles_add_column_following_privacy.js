exports.up = async (knex) =>
  knex.schema.table('profiles', (table) => {
    table
      .enu('following_privacy', ['private', 'public', 'followed_profiles'])
      .notNullable()
      .defaultTo('private');
  });

exports.down = async (knex) =>
  knex.schema.table('profiles', (table) => {
    table.dropColumn('following_privacy');
  });
