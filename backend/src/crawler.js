const axios = require('axios');
const knex = require('./database');

(async () => {
  const url = 'https://apis.justwatch.com/content/providers/locale/pt_BR';

  try {
    const response = await axios.get(url);
    // console.log(response.data);

    const providers = response.data.map(({ clear_name, short_name }) => (
      { name: clear_name, short_name }
    ));
    // console.log(providers);
    
    for (provider of providers) {
      await knex('providers').insert(provider);
      console.log(provider);
    }
    console.log('Banco populado')
    
  } catch (err) {
    console.log('Something went wrong ' + err);
  }

  knex.destroy();
})();