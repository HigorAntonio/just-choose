const axios = require('axios');
const knex = require('./database');

async function getData({ baseURL, url, params = {} }) {
  try {
    const response = await axios({ baseURL, url, params });
    return response.data;
  } catch (err) {
    if (err.response) {
      console.log(`Erro: Request: { baseURL: ${baseURL}, url: ${url}, ` + 
      `params: ${params} }. Código de status http ${err.response.status}`);
    } else if (err.request) {
      console.log(`Erro: Request: { baseURL: ${baseURL}, url: ${url}, ` + 
      `params: ${params} }. Sem resposta do servidor`);
    } else {
      console.log(`Erro: Request: { baseURL: ${baseURL}, url: ${url},` + 
      ` params: ${params} }. ${err.message}`);
    }
    throw err;
  }
}

function sanitizeProviders(providersData) {
  try {
    return providersData.map(({ id, clear_name, short_name }) => (
      { jw_id: id, name: clear_name, short_name }
    ));
  } catch (err) {
    console.log(`Erro: sanitizeProviders(). ${err.message}`);
  }
}

function sanitizeGenres(genresData) {
  try {
    return genresData.map(({ translation, short_name }) => (
      { name: translation, short_name }
    ));
  } catch (err) {
    console.log(`Erro: sanitizeGenres(). ${err.message}`);
  }
}

(async () => {
  const baseURL = 'https://apis.justwatch.com/';
  const providersUrl = '/content/providers/locale/pt_BR';
  const genresUrl = '/content/genres/locale/pt_BR';

  try {
    const providersData = await getData({ baseURL, url: providersUrl });
    const providers = sanitizeProviders(providersData);
    // console.log(providers);
    
    for (provider of providers) {
      const query = await knex('providers').where({ jw_id: provider.jw_id });
      if (query.length === 0) {
        await knex('providers').insert(provider);
      }
      console.log(provider);
    }
    console.log('Banco populado com providers')


    const genresData = await getData({ baseURL, url: genresUrl });
    const genres = sanitizeGenres(genresData);
    // console.log(genres);
    
    for (genre of genres) {
      const query = await knex('genres').where({ short_name: genre.short_name });
      if (query.length === 0) {
        await knex('genres').insert(genre);
      }
      console.log(genre);
    }
    console.log('Banco populado com genres')

  } catch (err) {
    console.log('Something went wrong ' + err);
  }

  knex.destroy();
})();