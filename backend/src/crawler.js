const axios = require('axios');
const knex = require('./database');

async function getData({ baseURL, url, params = {} }) {
  try {
    const response = await axios({ baseURL, url, params });
    return response.data;
  } catch (err) {
    if (err.response) {
      console.log(`Erro: Request: { baseURL: ${baseURL}, url: ${url}, ` + 
      `params: ${JSON.stringify(params)} }. Código de status http ${err.response.status}`);
    } else if (err.request) {
      console.log(`Erro: Request: { baseURL: ${baseURL}, url: ${url}, ` + 
      `params: ${JSON.stringify(params)} }. Sem resposta do servidor`);
    } else {
      console.log(`Erro: Request: { baseURL: ${baseURL}, url: ${url},` + 
      ` params: ${JSON.stringify(params)} }. ${err.message}`);
    }
    throw err;
  }
}

function sanitizeProviders(providersData) {
  try {
    return providersData.map(({ id = '', clear_name = '', short_name = '' }) => (
      { jw_id: id, name: clear_name, short_name }
    ));
  } catch (err) {
    console.log(`Erro: sanitizeProviders(). ${err.message}`);
    throw err;
  }
}

function sanitizeGenres(genresData) {
  try {
    return genresData.map(({ translation = '', short_name = '' }) => (
      { name: translation, short_name }
    ));
  } catch (err) {
    console.log(`Erro: sanitizeGenres(). ${err.message}`);
    throw err;
  }
}

function sanitizeMovies(moviesData) {
  try {
    return moviesData.items.map(({ title = '', scoring = '' }) => {
      const [provider] = scoring.filter(scoring => scoring.provider_type === 'tmdb:id')

      return { title, tmdb_id: provider ? provider.value : '' };
    });
  } catch (err) {
    console.log(`Erro: sanitizeMovies(). ${err.message}`);
    throw err;
  }
}

async function dbInsertArrayData(arrayData, dbTableName, condition) {
  try {
    for (data of arrayData) {
      const dataExists = await knex(dbTableName).where(condition(data)).first();
      if (!dataExists) {
        await knex(dbTableName).insert(data);
      }
      console.log(data);
    }
  } catch (err) {
    console.log(`Erro: dbInsertArrayData(): { arrayData: ${JSON.stringify(arrayData)},` + 
      ` dbTableName: ${dbTableName} } . ${err.message}`);
    throw err;
  }
}

async function dbInsertMovieData(movieData, providerId, genreId) {
  try {
    for (movie of movieData) {
      const movieExists = await knex('movies').where({ tmdb_id: movie.tmdb_id }).first();
      if (!movieExists) {
        const [movieId] = await knex('movies').insert(movie, 'id');
        await knex('movie_providers').insert({ movie_id: movieId, provider_id: providerId });
        await knex('movie_genres').insert({ movie_id: movieId, genre_id: genreId });
      } else {
        const [movieProviderExists] = await knex('movie_providers')
          .where({ movie_id: movieExists.id, provider_id: providerId })
          .update({ movie_id: movieExists.id, provider_id: providerId })
          .returning('id');
        if (!movieProviderExists) {
          await knex('movie_providers').insert({ movie_id: movieExists.id, provider_id: providerId });
        }

        const [movieGenreExists] = await knex('movie_genres')
          .where({ movie_id: movieExists.id, genre_id: genreId })
          .update({ movie_id: movieExists.id, genre_id: genreId })
          .returning('id');
        if (!movieGenreExists) {
          await knex('movie_genres').insert({ movie_id: movieExists.id, genre_id: genreId });
        }
      }
    }
  } catch (err) {
    console.log(`Erro: dbInsertMovieData(): ${err.message}`);
    throw err;
  }
}

async function getGenres() {
  try {
    const genres = await knex('genres').select('id', 'short_name');
    return genres;
  } catch (err) {
    console.log(`Erro: getAllGenresUrl(). ${err.message}`);
    throw err;
  }
}

async function getProviders() {
  try {
    const providers = await knex('providers').select('id', 'short_name')
      .where({ name: 'Netflix' }).orWhere({ name: 'Amazon Prime Video' });
      return providers;
  } catch (err) {
    console.log(`Erro: getProvidersUrl(). ${err.message}`);
    throw err;
  }
}

(async () => {
  const baseURL = 'https://apis.justwatch.com/';
  const providersUrl = '/content/providers/locale/pt_BR';
  const genresUrl = '/content/genres/locale/pt_BR';
  const moviesUrl =  '/content/titles/pt_BR/popular';
  const moviesParams = { 
    body: {
      fields: [
        "cinema_release_date", "full_path", "full_paths" , 
        "id", "localized_release_date", "object_type", "poster", 
        "scoring", "title", "tmdb_popularity", "offers"
      ],
      content_types: ["movie"],
      genres: [
        "msc","act","ani","cmy","crm","fml","eur","hrr","hst","fnt",
        "drm","doc","rly","wsn","war","scf","rma","trl","spt"
      ],
      providers:["prv"],
      enable_provider_filter: false,
      monetization_types:[],
      page: 1,
      page_size:30,
      matching_offers_only:true
    }
  }

  try {
    const providersData = await getData({ baseURL, url: providersUrl });
    const providers = sanitizeProviders(providersData);
    // console.log(providers);
    
    await dbInsertArrayData(providers, 'providers', (data) => ({ jw_id: data.jw_id }));
    console.log('Banco populado com providers')


    const genresData = await getData({ baseURL, url: genresUrl });
    const genres = sanitizeGenres(genresData);
    // console.log(genres);
    
    await dbInsertArrayData(genres, 'genres', (data) => ({ short_name: data.short_name }));
    console.log('Banco populado com genres')
    
    const allGenres = await getGenres();
    const allProviders = await getProviders();
    for (provider of allProviders) {
      moviesParams.body.providers = [provider.short_name];
      for (genre of allGenres) {
        moviesParams.body.genres = [genre.short_name];
        moviesParams.body.page = 1;
        while (true) {
          const moviesData = await getData({ baseURL, url: moviesUrl, params: moviesParams });
          // console.log(moviesData.page, moviesData.total_pages);
          // console.log(sanitizeMovies(moviesData));
          
          const movies = sanitizeMovies(moviesData);
          // await dbInsertArrayData(movies, 'movies', (data) => ({ tmdb_id: data.tmdb_id }));
          await dbInsertMovieData(movies, provider.id, genre.id);
          console.log(`Banco populado com movies ${provider.short_name} do genero ${genre.short_name}` + 
            ` da pagina ${moviesData.page} de ${moviesData.total_pages}`);

          moviesParams.body.page++;
          if(moviesData.page >= moviesData.total_pages) break;
        }
      }
    }

  } catch (err) {
    console.log('Something went wrong ' + err);
  }

  knex.destroy();
})();

// 'https://apis.justwatch.com/content/titles/pt_BR/popular?body=%7B"fields":["cinema_release_date","full_path","full_paths","id","localized_release_date","object_type","poster","scoring","title","tmdb_popularity","offers"],"content_types":["movie"],"genres":["msc","act","ani","cmy","crm","fml","eur","hrr","hst","fnt","drm","doc","rly","wsn","war","scf","rma","trl","spt"],"providers":["prv","nfx"],"enable_provider_filter":false,"monetization_types":[],"page":2,"page_size":30,"matching_offers_only":true%7D'