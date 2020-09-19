const axios = require('axios');
const knex = require('./database');

async function getData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.log(`Erro: arquivo crawler.js, função getData(url). Falha ao obter dados do` + 
      `servidor. Código de status http ${err.response.status}`);
    } else if (err.request) {
      console.log('Erro: arquivo crawler.js, função getData(url). Sem resposta do servidor');
    } else {
      console.log('Erro: arquivo crawler.js, função getData(url). ', err.message);
    }
    throw err;
  }
}

function sanitizeProviders(providersData) {
  try {
    return providersData.map(({ clear_name, short_name }) => (
      { name: clear_name, short_name }
    ));
  } catch (err) {
    console.log('Erro: arquivo crawler.js, função sanitizeProviders(providersData). ', err.message);
  }
}

(async () => {
  const providersUrl = 'https://apis.justwatch.com/content/providers/locale/pt_BR';

  try {
    const providersData = await getData(providersUrl);
    const providers = sanitizeProviders(providersData);
    // console.log(providers);
    
    for (provider of providers) {
      await knex('providers').insert(provider);
      console.log(provider);
    }
    console.log('Banco populado com providers')

  } catch (err) {
    console.log('Something went wrong ' + err);
  }

  knex.destroy();
})();