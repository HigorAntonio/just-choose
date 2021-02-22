exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('content_types')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('content_types').insert([
        { name: 'movie' },
        { name: 'show' },
        { name: 'game' },
      ]);
    });
};
