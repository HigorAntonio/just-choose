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

async function getAllGenresUrl() {
  try {
    const genres = await knex('genres').select('short_name');
    let genresUrl = '';
    for (genre of genres) {
      genresUrl = genresUrl.concat(`"${genre.short_name}", `);
    }
    return genresUrl.slice(0, -2);
  } catch (err) {
    console.log(`Erro: getAllGenresUrl(). ${err.message}`);
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

'https://apis.justwatch.com/content/titles/pt_BR/popular?body=%7B"fields":["cinema_release_date","full_path","full_paths","id","localized_release_date","object_type","poster","scoring","title","tmdb_popularity","offers"],"content_types":["movie"],"genres":["msc","act","ani","cmy","crm","fml","eur","hrr","hst","fnt","drm","doc","rly","wsn","war","scf","rma","trl","spt"],"providers":["prv","nfx"],"enable_provider_filter":false,"monetization_types":[],"page":2,"page_size":30,"matching_offers_only":true%7D'