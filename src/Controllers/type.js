const axios = require('axios');


const infoTypeApy = async () => {
    const res = await axios.get('https://pokeapi.co/api/v2/type/');
    const types = res.data.results;
    const typeList = types.map(type => {
      return {
        name: type.name,
        url: type.url
      };
    });
    return typeList;
  };

module.exports = { infoTypeApy };