exports.seed = async function (knex) {
  // Verifica se a tabela já contém dados
  const existingEntries = await knex('content_types').select('id').first();

  // Só insere os dados se a tabela estiver vazia
  if (!existingEntries) {
    await knex('content_types').insert([
      { name: 'movie' },
      { name: 'show' },
      { name: 'game' },
    ]);
  }
};
