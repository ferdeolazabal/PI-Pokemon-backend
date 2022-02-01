const axios = require('axios');
const { Pokemon, Type } = require('../db')

// Lista Pokemons desde api
const getApiPokeList = async () => {
    
    const totalPokemons = 40;
    
    try {
        const apiUrl = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${ totalPokemons }`);
        const resApiResults  = await apiUrl.data.results.map(obj => axios.get(obj.url));
        const infoUrlUnitPoke = await axios.all(resApiResults);
        const fullDataPokemons = infoUrlUnitPoke.map(obj => obj.data);
        const infoPokemons = fullDataPokemons.map(poke => {
            return {
                // id: poke.id,
                name: poke.name,
                life: poke.stats[0].base_stat,
                attack: poke.stats[1].base_stat,
                defense: poke.stats[2].base_stat,
                speed: poke.stats[5].base_stat,
                height: poke.height,
                weight: poke.weight,
                img: poke.sprites.other.dream_world.front_default,
                types: poke.types.map(type => type.type.name),
            };
        });
        return infoPokemons;
        
    } catch (err) {
        console.log(err);
        return err
    };
};

// const getApiPokeList = () => {

//     const totalPokemons = 40;

//     try {

//         return axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${ totalPokemons }`)
//             .then(res => {
//                 const apiResults = res.data.results;
//                 const infoUrlUnitPokepromise = apiResults.map(obj => axios.get(obj.url));
//                 const fullDataPokemons = axios.all(infoUrlUnitPokepromise);
//                 // console.log('infoUrlUnitPokepromise',infoUrlUnitPokepromise)
//                 // console.log('full-data-pokemons',fullDataPokemons)
//                 const promiseResp = fullDataPokemons.then(res => {
//                     const fullDataPokemons = res.map(obj => obj.data);
//                     const infoPokemons = fullDataPokemons.map(poke => {
//                         return {
//                             id: poke.id,
//                             name: poke.name,
//                             life: poke.stats[0].base_stat,
//                             attack: poke.stats[1].base_stat,
//                             defense: poke.stats[2].base_stat,
//                             speed: poke.stats[5].base_stat,
//                             height: poke.height,
//                             weight: poke.weight,
//                             img: poke.sprites.other.dream_world.front_default,
//                             types: poke.types.map(type => type.type.name),
//                         };
//                     });
//                     return infoPokemons;
//                 });
//                 return promiseResp;
//             });
//     } catch (err) {
//         console.log(err);
//         return err
//     };
// };

// Lista Pokemons desde la DB
const getDbInfo = async () => {

    let pokeArray = [];
    
    try {
        const pokemons = await Pokemon.findAll({
            include: { model: Type },
        });
        // console.log(pokemons);
        pokemons.forEach(poke => {
            const pokeInfo = {
                id: poke.id,
                name: poke.name,
                life: poke.life,
                attack: poke.attack,
                defense: poke.defense,
                speed: poke.speed,
                height: poke.height,
                weight: poke.weight,
                img: poke.img,
                createdInDb: poke.createdInDb,
                types: poke.types.map(type => type.name),
            };
            pokeArray.push(pokeInfo);
        });
        // console.log('poke array en controllers',pokeArray);
        return pokeArray;
        
    } catch (err) {
        console.log(err);
        return err
    };
};


const getAllPokemons = async () => {
    
    const db = await getDbInfo();
    // console.log('first db', db);
    try {
        if (db.length === 0) {
            console.log("Vamos a llenar la base de datos...");
            const api = await getApiPokeList();
            // console.log('api', api);
            const chargeDbb = api.map(async (el) => {
                const isPokemons = await Pokemon.create({
                    name: el.name,
                    life: el.life,
                    attack: el.attack,
                    defense: el.defense,
                    speed: el.speed,
                    height: el.height,
                    weight: el.weight,
                    img: el.img,
                    
                })
                const isType = await Type.findAll({ where: { name: el.types } });
                await isPokemons.addTypes(isType);
            });
            const promiseSolved = await Promise.all(chargeDbb);
            // console.log('promiseSolved', promiseSolved);
            const newDb = await getDbInfo();
            // console.log('newDb', newDb);
            return newDb;

        } else {
        console.log("La base de datos ya contiene la data...");
            return db;
        }
    } catch (error) {
        console.log('1',error);
    }
};

// const getAllPokemons = () => {

//     return getApiPokeList().then(apiInfo => {
//         return getDbInfo().then(dbInfo => {
//             const totalPokemons = [ ...apiInfo, ...dbInfo ];
//             return totalPokemons;
//         });
//     });
// };

// Lista Pokemons desde API y DB por nombre
const getPokeByName = async (name) => {
    try {
        
        const searchPokeNameDB = await Pokemon.findOne({
            where: { name },
            include: { model: Type },
        })

        if (searchPokeNameDB !== null) {

            const pokeByname = searchPokeNameDB.dataValues;
            const pokeBynameInfo = {
                id: pokeByname.id,
                name: pokeByname.name,
                img: pokeByname.img,
                types: pokeByname.types.map(type => type.name),
            };
            console.log('searchPokeNameDB', pokeBynameInfo);
            
            return pokeBynameInfo;
        
        } else {
            return 'Pokemon no encontrado';
        // }else {
        //     const searchPokeapiName = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        //     const foundPokeapiName = objPokeApi(searchPokeapiName.data);
        //     return foundPokeapiName
        };
    } catch (error) {
        console.log(error);
        return error;
    };
};

// Lista Pokemons desde api por ID
const getPokeById = async (id) => {
    
    try{

        const getPokeByIdDB = await Pokemon.findOne({
            where: { id },
            include: { model: Type }
        })
        if (getPokeByIdDB) {
            return getPokeByIdDB;
        }else {
            const apiUrl = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const infoPoke = apiUrl.data;
            const pokeDetail = objPokeApi(infoPoke);
            return pokeDetail
        };

    } catch (err) {
        console.log(err);
        return err
    };
};
// template de objeto pokemon
const objPokeApi = (poke) => {
    const objPokeapi =
    {
        id: poke.id,
        name: poke.name,
        life: poke.stats[0].base_stat,
        attack: poke.stats[1].base_stat,
        defense: poke.stats[2].base_stat,
        speed: poke.stats[5].base_stat,
        height: poke.height,
        weight: poke.weight,
        img: poke.sprites.other.dream_world.front_default,
        types: poke.types.map(type => type.type.name)
    };
    return objPokeapi
};

module.exports = {
    getApiPokeList,
    getPokeById, 
    getDbInfo,
    getAllPokemons,
    getPokeByName
};